import type { Metadata } from "next";
import { Suspense } from "react";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { PostCard } from "@/features/blog/components/post-card";
import { PublicCategoryFilter } from "@/features/blog/components/public-category-filter";
import { listPublicCategories, listPublicPosts } from "@/features/blog/queries";

const DESCRIPTION = "Estratégia, tecnologia e bastidores para quem cria experiências de marca, aprendizagem e eventos.";

export const metadata: Metadata = { title: "Blog", description: DESCRIPTION };

export default function BlogPage({ searchParams }: PageProps<"/blog">) {
  return (
    <main className="site-container flex flex-1 flex-col gap-12 pt-14 pb-20 md:pt-20 md:pb-24">
      <header className="flex flex-col gap-6">
        <p className="eyebrow">Blog Miniverso</p>
        <h1 className="text-5xl leading-[1.05] font-extrabold tracking-tight text-balance md:text-7xl">
          Ideias para expandir o possível.
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">{DESCRIPTION}</p>
      </header>

      <Suspense fallback={<PostListSkeleton />}>
        <PostList searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function PostList({ searchParams }: Pick<PageProps<"/blog">, "searchParams">) {
  const { categoria } = await searchParams;
  const active = typeof categoria === "string" ? categoria : undefined;

  const [posts, categories] = await Promise.all([listPublicPosts(active), listPublicCategories()]);

  return (
    <div className="flex flex-col gap-10">
      {categories.length > 0 && <PublicCategoryFilter categories={categories} active={active} />}

      {posts.length > 0 ? (
        <ul className="grid gap-x-6 gap-y-10 md:grid-cols-2">
          {posts.map((post, index) => (
            <li key={post.slug}>
              <PostCard post={post} preload={index < 2} />
            </li>
          ))}
        </ul>
      ) : (
        <Empty className="border bg-card">
          <EmptyHeader>
            <EmptyTitle>{active ? "Nenhum artigo nesta categoria" : "Nenhum artigo ainda"}</EmptyTitle>
            <EmptyDescription>
              {active ? "Tente outra categoria." : "Em breve, novas ideias por aqui."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  );
}

function PostListSkeleton() {
  return (
    <div className="flex flex-col gap-10">
      <Skeleton className="h-8 w-72 rounded-full" />
      <div className="grid gap-x-6 gap-y-10 md:grid-cols-2">
        <Skeleton className="aspect-[7/5] rounded-2xl md:aspect-video" />
        <Skeleton className="aspect-[7/5] rounded-2xl md:aspect-video" />
      </div>
    </div>
  );
}
