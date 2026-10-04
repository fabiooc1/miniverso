"use client";

import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { PlayIcon } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { VIDEO_PROVIDER_LABELS, type VideoContent } from "@/features/video/video";

/** Visualização do bloco de vídeo dentro do editor de posts. */
export function VideoNodeView({ node, selected }: NodeViewProps) {
  const video = node.attrs as VideoContent;

  return (
    <NodeViewWrapper
      data-drag-handle
      className={cn("my-2 overflow-hidden rounded-2xl border", selected && "ring-3 ring-primary")}
    >
      <div className="relative aspect-video bg-black">
        {video.thumbnailUrl && <Image src={video.thumbnailUrl} alt="" fill sizes="720px" className="object-cover" />}
        <span className="absolute top-1/2 left-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-highlight text-highlight-foreground">
          <PlayIcon className="size-6 translate-x-0.5 fill-current" aria-hidden />
        </span>
        <Badge className="absolute top-3 left-3">{VIDEO_PROVIDER_LABELS[video.provider] ?? "Vídeo"}</Badge>
      </div>
      <p className="bg-card px-4 py-2 text-sm text-foreground">{video.title}</p>
    </NodeViewWrapper>
  );
}
