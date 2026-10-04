import { z } from "zod";

/**
 * Vídeos são sempre externos (YouTube ou Vimeo): nunca passam pelo serviço de
 * arquivos, o que evita estourar espaço e tráfego do armazenamento.
 * Guardamos o provedor e o id, nunca a URL colada; o endereço do player é
 * montado por nós, então só domínios conhecidos são embutidos.
 */
export const VIDEO_PROVIDERS = ["youtube", "vimeo"] as const;
export type VideoProvider = (typeof VIDEO_PROVIDERS)[number];

export const VIDEO_PROVIDER_LABELS: Record<VideoProvider, string> = {
  youtube: "YouTube",
  vimeo: "Vimeo",
};

/** Hosts das miniaturas devolvidas pelo oEmbed (liberados no next/image). */
export const VIDEO_THUMBNAIL_HOSTS = ["i.ytimg.com", "i.vimeocdn.com"] as const;

const YOUTUBE_ID = /^[\w-]{11}$/;
const VIMEO_ID = /^\d{1,12}$/;
const VIMEO_HASH = /^[\da-f]{6,20}$/;

export const videoSchema = z
  .object({
    provider: z.enum(VIDEO_PROVIDERS),
    videoId: z.string(),
    /** Hash de vídeos "não listados" do Vimeo. */
    hash: z.string().regex(VIMEO_HASH).optional(),
    title: z.string().trim().min(1, "Informe o título do vídeo.").max(200, "Use no máximo 200 caracteres."),
    thumbnailUrl: z
      .url()
      .refine((url) => VIDEO_THUMBNAIL_HOSTS.some((host) => new URL(url).hostname === host), "Miniatura inválida."),
  })
  .refine((video) => (video.provider === "youtube" ? YOUTUBE_ID : VIMEO_ID).test(video.videoId), {
    message: "Vídeo inválido.",
    path: ["videoId"],
  });

export type VideoContent = z.infer<typeof videoSchema>;

export type ParsedVideoUrl = Pick<VideoContent, "provider" | "videoId" | "hash">;

/**
 * Interpreta links do YouTube (watch, youtu.be, shorts, embed, live) e do
 * Vimeo (vimeo.com/123, vimeo.com/123/hash, player.vimeo.com/video/123).
 */
export function parseVideoUrl(input: string): ParsedVideoUrl | null {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  const host = url.hostname.replace(/^(www\.|m\.)/, "");
  const segments = url.pathname.split("/").filter(Boolean);

  if (host === "youtu.be" || host === "youtube.com" || host === "youtube-nocookie.com") {
    const videoId =
      host === "youtu.be"
        ? segments[0]
        : segments[0] === "watch"
          ? url.searchParams.get("v")
          : ["shorts", "embed", "live", "v"].includes(segments[0] ?? "")
            ? segments[1]
            : null;
    return videoId && YOUTUBE_ID.test(videoId) ? { provider: "youtube", videoId } : null;
  }

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const idIndex = segments.findIndex((segment) => VIMEO_ID.test(segment));
    if (idIndex < 0) return null;
    const hash = url.searchParams.get("h") ?? segments[idIndex + 1];
    return {
      provider: "vimeo",
      videoId: segments[idIndex],
      ...(hash && VIMEO_HASH.test(hash) ? { hash } : {}),
    };
  }

  return null;
}

/** Endereço público do vídeo (usado no oEmbed e em links "assistir no..."). */
export function getVideoWatchUrl({ provider, videoId, hash }: ParsedVideoUrl) {
  return provider === "youtube"
    ? `https://www.youtube.com/watch?v=${videoId}`
    : `https://vimeo.com/${videoId}${hash ? `/${hash}` : ""}`;
}

/** Endereço do player embutido. YouTube no modo sem cookies. */
export function getVideoEmbedUrl({ provider, videoId, hash }: ParsedVideoUrl, { autoplay = false } = {}) {
  if (provider === "youtube") {
    const params = new URLSearchParams({ rel: "0", ...(autoplay ? { autoplay: "1" } : {}) });
    return `https://www.youtube-nocookie.com/embed/${videoId}?${params}`;
  }
  const params = new URLSearchParams({ dnt: "1", ...(hash ? { h: hash } : {}), ...(autoplay ? { autoplay: "1" } : {}) });
  return `https://player.vimeo.com/video/${videoId}?${params}`;
}
