/** Chaves geradas pelo storage: `2026/10/<uuid>.webp`. */
const FILE_KEY_PATTERN = /^\d{4}\/\d{2}\/[0-9a-f-]{36}\.(jpg|png|webp|avif|gif)$/;

export function isValidFileKey(key: string) {
  return FILE_KEY_PATTERN.test(key);
}

/**
 * URL pública de um arquivo. Fica separada do provedor para poder ser usada
 * em Client Components; ao trocar de provedor, ajuste `NEXT_PUBLIC_FILES_BASE_URL`.
 */
export function getFileUrl(key: string) {
  const baseUrl = process.env.NEXT_PUBLIC_FILES_BASE_URL ?? "/uploads";
  return `${baseUrl}/${key}`;
}
