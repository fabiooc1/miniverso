import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer } from "@/features/admin/components/page-container";
import { requireAdmin } from "@/features/auth/session";
import { PostForm } from "@/features/blog/components/post-form";
import { getPostForEdit, listCategories } from "@/features/blog/queries";

export const metadata: Metadata = { title: "Editar post" };

export default async function EditPostPage({ params }: PageProps<"/admin/blog/[id]">) {
  await requireAdmin();

  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const [post, categories] = await Promise.all([getPostForEdit(id), listCategories()]);
  if (!post) notFound();

  return (
    <PageContainer className="max-w-7xl">
      {/* `key` reinicia o formulário ao navegar entre posts. */}
      <PostForm key={post.id} post={post} categories={categories.map(({ id, name }) => ({ id, name }))} />
    </PageContainer>
  );
}
