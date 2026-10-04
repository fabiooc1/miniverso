import type { Metadata } from "next";
import { PageContainer } from "@/features/admin/components/page-container";
import { requireAdmin } from "@/features/auth/session";
import { PostForm } from "@/features/blog/components/post-form";
import { listCategories } from "@/features/blog/queries";

export const metadata: Metadata = { title: "Novo post" };

export default async function NewPostPage() {
  await requireAdmin();
  const categories = await listCategories();

  return (
    <PageContainer className="max-w-7xl">
      <PostForm categories={categories.map(({ id, name }) => ({ id, name }))} />
    </PageContainer>
  );
}
