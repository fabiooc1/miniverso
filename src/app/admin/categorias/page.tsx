import type { Metadata } from "next";
import { PageContainer } from "@/features/admin/components/page-container";
import { PageHeader } from "@/features/admin/components/page-header";
import { requireAdmin } from "@/features/auth/session";
import { CategoriesManager } from "@/features/blog/components/categories-manager";
import { listCategories } from "@/features/blog/queries";

export const metadata: Metadata = { title: "Categorias" };

export default async function CategoriesPage() {
  await requireAdmin();
  const categories = await listCategories();

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Conteúdo editorial"
        title="Categorias"
        description="Todo post precisa de pelo menos uma categoria."
      />
      <CategoriesManager categories={categories} />
    </PageContainer>
  );
}
