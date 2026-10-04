import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    localPatterns: [{ pathname: "/uploads/**", search: "" }],
  },
  experimental: {
    serverActions: {
      // Uploads de imagem (limite de 5 MB validado no servidor) + margem.
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
