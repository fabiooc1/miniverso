import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getFileUrl } from "@/lib/storage/keys";
import type { PublicPostListItem } from "../queries";

type PostCardProps = {
  post: PublicPostListItem;
  preload?: boolean;
};

export function PostCard({ post, preload }: PostCardProps) {
  const categories = post.categories.map((category) => category.name).join(", ");

  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col gap-3">
      <div className="relative aspect-[7/5] overflow-hidden rounded-2xl bg-card md:aspect-video">
        <Image
          src={getFileUrl(post.coverImageKey)}
          alt={post.coverImageAlt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          preload={preload}
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <p className="mt-1 text-xs font-bold text-primary">
        {categories} · {post.readingTime} min
      </p>
      <h2 className="text-2xl leading-tight tracking-tight text-balance md:text-3xl">{post.title}</h2>
      <span className="inline-flex items-center gap-1 text-sm font-bold">
        Ler artigo
        <ArrowUpRightIcon className="size-4" aria-hidden />
      </span>
    </Link>
  );
}
