import { PlusIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { PageContainer } from "@/features/admin/components/page-container";
import { PageHeader } from "@/features/admin/components/page-header";
import { requireAdmin } from "@/features/auth/session";
import { CategoryFilter, PostSearch, PostSortSelect } from "@/features/blog/components/post-filters";
import { PostTable } from "@/features/blog/components/post-table";
import { countPosts, listAdminPosts, listCategories } from "@/features/blog/queries";
import { isPostSort } from "@/features/blog/schemas";
import { pluralize } from "@/lib/format";

export const metadata: Metadata = { title: "Blog" };

export default async function AdminBlogPage({ searchParams }: PageProps<"/admin/blog">) {
  await requireAdmin();

  const { q, categoria, ordem } = await searchParams;
  const query = typeof q === "string" ? q.trim() : undefined;
  const categorySlug = typeof categoria === "string" ? categoria : undefined;
  const sort = isPostSort(ordem) ? ordem : "recentes";

  const [posts, categories, total] = await Promise.all([
    listAdminPosts({ query, categorySlug, sort }),
    listCategories(),
    countPosts(),
  ]);
  const isFiltering = Boolean(query || categorySlug);

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Conteúdo editorial"
        title="Posts do blog"
        actions={
          <Button variant="highlight" asChild>
            <Link href="/admin/blog/novo">
              <PlusIcon data-icon="inline-start" />
              Novo post
            </Link>
          </Button>
        }
      />

      <Card>
        <CardContent className="flex flex-col gap-4">
          <PostSearch />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CategoryFilter categories={categories.map(({ name, slug }) => ({ name, slug }))} />
            <Badge variant="success">{pluralize(total, "post publicado", "posts publicados")}</Badge>
          </div>
        </CardContent>
      </Card>

      {posts.length > 0 ? (
        <PostTable posts={posts} />
      ) : (
        <Empty className="border bg-card">
          <EmptyHeader>
            <EmptyTitle>{isFiltering ? "Nenhum post encontrado" : "Nenhum post ainda"}</EmptyTitle>
            <EmptyDescription>
              {isFiltering ? "Tente outra busca ou categoria." : "Escreva o primeiro post do blog da Miniverso."}
            </EmptyDescription>
          </EmptyHeader>
          {!isFiltering && (
            <EmptyContent>
              <Button variant="highlight" asChild>
                <Link href="/admin/blog/novo">Novo post</Link>
              </Button>
            </EmptyContent>
          )}
        </Empty>
      )}

      <footer className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <span>{pluralize(posts.length, "post encontrado", "posts encontrados")}</span>
        <span className="flex items-center gap-2">
          Ordenar por: <PostSortSelect value={sort} />
        </span>
      </footer>
    </PageContainer>
  );
}
