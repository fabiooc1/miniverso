export const IMAGE_MAX_BYTES = 5 * 1024 * 1024;

/** SVG fica de fora de propósito: pode carregar scripts. */
export const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

export const IMAGE_ACCEPT = Object.keys(IMAGE_EXTENSIONS).join(",");

export function validateImageFile(file: File): string | null {
  if (!(file.type in IMAGE_EXTENSIONS)) {
    return "Formato não suportado. Use JPG, PNG, WebP, AVIF ou GIF.";
  }

  if (file.size > IMAGE_MAX_BYTES) {
    return "A imagem deve ter no máximo 5 MB.";
  }

  return null;
}
