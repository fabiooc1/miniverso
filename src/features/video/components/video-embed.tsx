"use client";

import { PlayIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { getVideoEmbedUrl, VIDEO_PROVIDER_LABELS, type VideoContent } from "../video";

type VideoEmbedProps = {
  video: VideoContent;
  sizes: string;
  className?: string;
  priority?: boolean;
};

/**
 * Player leve: mostra a miniatura e só carrega o iframe do provedor (cerca de
 * 1 MB de JavaScript) quando a pessoa clica. Preenche o contêiner pai, que deve
 * ser `relative`.
 */
export function VideoEmbed({ video, sizes, className, priority }: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        src={getVideoEmbedUrl(video, { autoplay: true })}
        title={video.title}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        className={cn("absolute inset-0 size-full border-0 bg-black", className)}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Reproduzir vídeo: ${video.title} (${VIDEO_PROVIDER_LABELS[video.provider]})`}
      className={cn("group/video absolute inset-0 size-full cursor-pointer overflow-hidden bg-black", className)}
    >
      <Image src={video.thumbnailUrl} alt="" fill sizes={sizes} priority={priority} className="object-cover" />
      <span className="absolute inset-0 bg-brand-night/20 transition group-hover/video:bg-brand-night/40" />
      <span className="absolute top-1/2 left-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-highlight text-highlight-foreground shadow-lg transition group-hover/video:scale-110">
        <PlayIcon className="size-7 translate-x-0.5 fill-current" aria-hidden />
      </span>
    </button>
  );
}
