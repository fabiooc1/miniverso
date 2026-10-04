"use server";

import { requireAdmin } from "@/features/auth/session";
import { actionError, type ActionResult } from "@/lib/action-result";
import { getVideoWatchUrl, parseVideoUrl, videoSchema, type VideoContent } from "./video";

const OEMBED_ENDPOINTS = {
  youtube: "https://www.youtube.com/oembed",
  vimeo: "https://vimeo.com/api/oembed.json",
} as const;

/**
 * A miniatura do oEmbed do YouTube (`hqdefault`) é 4:3 com faixas pretas
 * embutidas. Prefere as versões 16:9 quando existem (vídeos antigos não têm).
 */
async function findWidescreenYoutubeThumbnail(videoId: string) {
  for (const variant of ["maxresdefault", "hq720"]) {
    const url = `https://i.ytimg.com/vi/${videoId}/${variant}.jpg`;
    try {
      const response = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(4000), cache: "no-store" });
      if (response.ok) return url;
    } catch {
      // Tenta a próxima variante; no fim, fica a miniatura do oEmbed.
    }
  }
  return null;
}

/**
 * Valida um link de vídeo e busca título e miniatura no oEmbed do provedor.
 * Também confirma que o vídeo existe e pode ser embutido.
 */
export async function resolveVideo(input: string): Promise<ActionResult<VideoContent>> {
  await requireAdmin();

  const parsed = parseVideoUrl(input);
  if (!parsed) {
    return actionError("Cole um link do YouTube ou do Vimeo.");
  }

  const endpoint = new URL(OEMBED_ENDPOINTS[parsed.provider]);
  endpoint.searchParams.set("url", getVideoWatchUrl(parsed));
  endpoint.searchParams.set("format", "json");

  let oembed: { title?: string; thumbnail_url?: string };
  try {
    const response = await fetch(endpoint, { signal: AbortSignal.timeout(8000), cache: "no-store" });
    if (!response.ok) {
      return actionError("Vídeo não encontrado, privado ou com incorporação desativada.");
    }
    oembed = await response.json();
  } catch {
    return actionError("Não foi possível consultar o vídeo agora. Tente novamente.");
  }

  const thumbnailUrl =
    (parsed.provider === "youtube" && (await findWidescreenYoutubeThumbnail(parsed.videoId))) ||
    oembed.thumbnail_url;

  const video = videoSchema.safeParse({
    ...parsed,
    title: oembed.title?.slice(0, 200) || "Vídeo",
    thumbnailUrl,
  });
  if (!video.success) {
    return actionError("Não foi possível obter os dados deste vídeo.");
  }

  return { ok: true, data: video.data };
}
