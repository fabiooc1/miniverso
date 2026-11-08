import "server-only";

import { cacheTag } from "next/cache";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { RichTextNode } from "./lib/rich-text";
import type { PostSort } from "./schemas";

export const BLOG_CACHE_TAG = "blog";

type PostFilters = {
  query?: string;
  categorySlug?: string;
  sort: PostSort;
};

const ORDER_BY: Record<PostSort, Prisma.PostOrderByWithRelationInput> = {
  recentes: { createdAt: "desc" },
  antigos: { createdAt: "asc" },
  titulo: { title: "asc" },
};

/** Lista do painel. Chame após `requireAdmin`. */
export async function listAdminPosts({ query, categorySlug, sort }: PostFilters) {
  const where: Prisma.PostWhereInput = {
    AND: [
      query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { categories: { some: { name: { contains: query, mode: "insensitive" } } } },
              { author: { name: { contains: query, mode: "insensitive" } } },
            ],
          }
        : {},
      categorySlug ? { categories: { some: { slug: categorySlug } } } : {},
    ],
  };

  return prisma.post.findMany({
    where,
    orderBy: ORDER_BY[sort],
    select: {
      id: true,
      slug: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      coverImageKey: true,
      coverImageAlt: true,
      categories: { select: { id: true, name: true }, orderBy: { name: "asc" } },
      author: { select: { name: true } },
    },
  });
}

export type AdminPostListItem = Awaited<ReturnType<typeof listAdminPosts>>[number];

export async function countPosts() {
  return prisma.post.count();
}

/** Post para o formulário de edição. Chame após `requireAdmin`. */
export async function getPostForEdit(id: number) {
  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      content: true,
      coverImageKey: true,
      coverImageAlt: true,
      readingTime: true,
      createdAt: true,
      updatedAt: true,
      categories: { select: { id: true } },
      author: { select: { name: true } },
    },
  });

  if (!post) return null;

  const { categories, content, ...rest } = post;
  return {
    ...rest,
    content: content as RichTextNode,
    categoryIds: categories.map((category) => category.id),
  };
}

export type PostForEdit = NonNullable<Awaited<ReturnType<typeof getPostForEdit>>>;

export async function listCategories() {
  return prisma.postCategory.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true, _count: { select: { posts: true } } },
  });
}

export type CategoryListItem = Awaited<ReturnType<typeof listCategories>>[number];

/** Posts do blog público, do mais recente ao mais antigo (cacheados até a próxima gravação). */
export async function listPublicPosts(categorySlug?: string) {
  "use cache";
  cacheTag(BLOG_CACHE_TAG);

  return prisma.post.findMany({
    where: categorySlug ? { categories: { some: { slug: categorySlug } } } : undefined,
    orderBy: { createdAt: "desc" },
    select: {
      slug: true,
      title: true,
      coverImageKey: true,
      coverImageAlt: true,
      readingTime: true,
      categories: { select: { name: true }, orderBy: { name: "asc" } },
    },
  });
}

export type PublicPostListItem = Awaited<ReturnType<typeof listPublicPosts>>[number];

/** Categorias com pelo menos um post, para o filtro do blog público. */
export async function listPublicCategories() {
  "use cache";
  cacheTag(BLOG_CACHE_TAG);

  return prisma.postCategory.findMany({
    where: { posts: { some: {} } },
    orderBy: { name: "asc" },
    select: { name: true, slug: true },
  });
}

/** Artigo do blog público pela URL. */
export async function getPublicPost(slug: string) {
  "use cache";
  cacheTag(BLOG_CACHE_TAG);

  const post = await prisma.post.findUnique({
    where: { slug },
    select: {
      title: true,
      excerpt: true,
      content: true,
      coverImageKey: true,
      coverImageAlt: true,
      readingTime: true,
      createdAt: true,
      categories: { select: { name: true }, orderBy: { name: "asc" } },
      author: { select: { name: true } },
    },
  });

  return post && { ...post, content: post.content as RichTextNode };
}
