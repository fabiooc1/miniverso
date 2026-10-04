"use server";

import { refresh, updateTag } from "next/cache";
import { requireAdmin } from "@/features/auth/session";
import { deleteUnreferencedFiles } from "@/features/uploads/references";
import { Prisma } from "@/generated/prisma/client";
import { actionError, zodFieldErrors, type ActionResult } from "@/lib/action-result";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { estimateReadingTime } from "./lib/rich-text";
import { BLOG_CACHE_TAG } from "./queries";
import { categoryInputSchema, postInputSchema } from "./schemas";

function isUniqueViolation(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

/** Cria (sem `id`) ou atualiza um post. O post é publicado ao salvar. */
export async function savePost(id: number | null, input: unknown): Promise<ActionResult<{ id: number }>> {
  const session = await requireAdmin();

  const parsed = postInputSchema.safeParse(input);
  if (!parsed.success) {
    // Erros internos do documento (ex.: "content.content.1.attrs") aparecem no campo "content".
    const issues = parsed.error.issues.map((issue) => ({ ...issue, path: issue.path.slice(0, 1) }));
    return actionError("Corrija os campos destacados.", zodFieldErrors(issues));
  }

  const { categoryIds, content, ...fields } = parsed.data;
  const existingCategories = await prisma.postCategory.count({ where: { id: { in: categoryIds } } });
  if (existingCategories !== categoryIds.length) {
    return actionError("Uma das categorias não existe mais. Recarregue a página.");
  }

  const data = {
    ...fields,
    content: content as Prisma.InputJsonValue,
    readingTime: estimateReadingTime(content),
  };
  const categories = categoryIds.map((categoryId) => ({ id: categoryId }));

  try {
    if (id === null) {
      const post = await prisma.post.create({
        data: { ...data, authorId: session.user.id, categories: { connect: categories } },
        select: { id: true },
      });
      updateTag(BLOG_CACHE_TAG);
      return { ok: true, message: "Post publicado.", data: { id: post.id } };
    }

    const previous = await prisma.post.findUnique({ where: { id }, select: { coverImageKey: true } });
    if (!previous) return actionError("Este post não existe mais.");

    await prisma.post.update({
      where: { id },
      data: { ...data, categories: { set: categories } },
    });

    if (previous.coverImageKey !== data.coverImageKey) {
      await deleteUnreferencedFiles([previous.coverImageKey]);
    }
    updateTag(BLOG_CACHE_TAG);
    return { ok: true, message: "Post atualizado.", data: { id } };
  } catch (error) {
    if (isUniqueViolation(error)) {
      return actionError("Já existe um post com esta URL.", { slug: "Já existe um post com esta URL." });
    }
    throw error;
  }
}

export async function deletePost(id: number): Promise<ActionResult> {
  await requireAdmin();

  const post = await prisma.post.delete({ where: { id }, select: { coverImageKey: true } }).catch(() => null);
  if (!post) return actionError("Este post não existe mais.");

  await deleteUnreferencedFiles([post.coverImageKey]);
  updateTag(BLOG_CACHE_TAG);
  refresh();
  return { ok: true, message: "Post excluído." };
}

type CategoryResult = ActionResult<{ id: number; name: string }>;

export async function createCategory(input: unknown): Promise<CategoryResult> {
  await requireAdmin();

  const parsed = categoryInputSchema.safeParse(input);
  if (!parsed.success) {
    return actionError("Verifique o nome da categoria.", zodFieldErrors(parsed.error.issues));
  }

  const slug = slugify(parsed.data.name);
  if (!slug) return actionError("Use letras ou números no nome.", { name: "Use letras ou números no nome." });

  try {
    const category = await prisma.postCategory.create({
      data: { name: parsed.data.name, slug },
      select: { id: true, name: true },
    });
    updateTag(BLOG_CACHE_TAG);
    refresh();
    return { ok: true, message: "Categoria criada.", data: category };
  } catch (error) {
    if (isUniqueViolation(error)) {
      return actionError("Já existe uma categoria com este nome.", { name: "Já existe uma categoria com este nome." });
    }
    throw error;
  }
}

export async function renameCategory(id: number, input: unknown): Promise<CategoryResult> {
  await requireAdmin();

  const parsed = categoryInputSchema.safeParse(input);
  if (!parsed.success) {
    return actionError("Verifique o nome da categoria.", zodFieldErrors(parsed.error.issues));
  }

  const slug = slugify(parsed.data.name);
  if (!slug) return actionError("Use letras ou números no nome.", { name: "Use letras ou números no nome." });

  try {
    const category = await prisma.postCategory.update({
      where: { id },
      data: { name: parsed.data.name, slug },
      select: { id: true, name: true },
    });
    updateTag(BLOG_CACHE_TAG);
    refresh();
    return { ok: true, message: "Categoria atualizada.", data: category };
  } catch (error) {
    if (isUniqueViolation(error)) {
      return actionError("Já existe uma categoria com este nome.", { name: "Já existe uma categoria com este nome." });
    }
    throw error;
  }
}

/**
 * Exclui uma categoria. Bloqueia quando algum post ficaria sem categoria,
 * pois todo post precisa de pelo menos uma.
 */
export async function deleteCategory(id: number): Promise<ActionResult> {
  await requireAdmin();

  const orphanPosts = await prisma.post.count({
    where: {
      categories: { some: { id } },
      NOT: { categories: { some: { id: { not: id } } } },
    },
  });

  if (orphanPosts > 0) {
    return actionError(
      orphanPosts === 1
        ? "1 post tem apenas esta categoria. Adicione outra categoria a ele antes de excluir."
        : `${orphanPosts} posts têm apenas esta categoria. Adicione outra categoria a eles antes de excluir.`,
    );
  }

  await prisma.postCategory.delete({ where: { id } }).catch(() => null);
  updateTag(BLOG_CACHE_TAG);
  refresh();
  return { ok: true, message: "Categoria excluída." };
}
