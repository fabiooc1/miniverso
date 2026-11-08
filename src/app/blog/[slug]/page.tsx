import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PostContent } from "@/features/blog/components/post-content";
import { getPublicPost } from "@/features/blog/queries";
import { SectionRenderer } from "@/features/sections/components/section-renderer";
import { getLandingSections } from "@/features/sections/queries";
import { formatLongDate } from "@/lib/format";
import { getFileUrl } from "@/lib/storage/keys";

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = await getPublicPost((await params).slug);
  return post ? { title: post.title, description: post.excerpt } : {};
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const [post, sections] = await Promise.all([getPublicPost(slug), getLandingSections()]);
  if (!post) notFound();

  const categories = post.categories.map((category) => category.name).join(", ");
  const contact = sections.find((section) => section.key === "contact");

  return (
    <main className="flex-1">
      <article className="site-container flex flex-col gap-12 pt-14 pb-16 md:pt-20">
        <header className="flex flex-col items-center gap-4 text-center">
          <p className="eyebrow">
            {categories} · {post.readingTime} min de leitura
          </p>
          <h1 className="max-w-5xl text-4xl leading-[1.05] font-extrabold tracking-tight text-balance md:text-6xl">
            {post.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            Por {post.author?.name ?? "Equipe Miniverso"} · {formatLongDate(post.createdAt)}
          </p>
        </header>

        <div className="relative aspect-[7/6] overflow-hidden rounded-3xl bg-card md:aspect-[2/1]">
          <Image
            src={getFileUrl(post.coverImageKey)}
            alt={post.coverImageAlt}
            fill
            sizes="(min-width: 1440px) 1312px, 100vw"
            preload
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-xl leading-relaxed font-bold text-foreground md:text-2xl">{post.excerpt}</p>
          <PostContent content={post.content} />
        </div>
      </article>
      {contact && <SectionRenderer section={contact} />}
    </main>
  );
}
