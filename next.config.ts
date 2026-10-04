import type { NextConfig } from "next";
import { VIDEO_THUMBNAIL_HOSTS } from "./src/features/video/video";

type RemotePattern = NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]>[number];

/**
 * Endereço público dos arquivos, conforme o provedor (`STORAGE_PROVIDER`).
 * `NEXT_PUBLIC_FILES_BASE_URL` no ambiente tem prioridade (ex.: uma CDN).
 */
function resolveFilesBaseUrl() {
  if (process.env.NEXT_PUBLIC_FILES_BASE_URL) return process.env.NEXT_PUBLIC_FILES_BASE_URL;

  const { STORAGE_PROVIDER, SUPABASE_URL, SUPABASE_STORAGE_BUCKET } = process.env;
  if (STORAGE_PROVIDER === "supabase" && SUPABASE_URL && SUPABASE_STORAGE_BUCKET) {
    return `${SUPABASE_URL.replace(/\/$/, "")}/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}`;
  }
  return "/uploads";
}

const filesBaseUrl = resolveFilesBaseUrl();

/** Libera no next/image o endereço dos arquivos quando ele é externo. */
function filesRemotePattern(): RemotePattern[] {
  if (!filesBaseUrl.startsWith("http")) return [];

  const url = new URL(filesBaseUrl);
  return [
    {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      port: url.port,
      pathname: `${url.pathname.replace(/\/$/, "")}/**`,
      search: "",
    },
  ];
}

const nextConfig: NextConfig = {
  cacheComponents: true,
  env: {
    NEXT_PUBLIC_FILES_BASE_URL: filesBaseUrl,
  },
  images: {
    localPatterns: [{ pathname: "/uploads/**", search: "" }],
    remotePatterns: [
      ...filesRemotePattern(),
      // Miniaturas dos vídeos (YouTube/Vimeo), obtidas pelo oEmbed.
      ...VIDEO_THUMBNAIL_HOSTS.map((hostname) => ({ protocol: "https" as const, hostname, pathname: "/**" })),
    ],
  },
  experimental: {
    serverActions: {
      // Uploads de imagem (limite de 5 MB validado no servidor) + margem.
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
