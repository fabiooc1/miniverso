import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Miniverso",
    short_name: "Miniverso",
    description:
      "Experiências imersivas em VR, AR e 3D feitas em São Luís (MA) para marcas de todo o Brasil.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    lang: "pt-BR",
    background_color: "#ffffff",
    theme_color: "#6c4cff",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
