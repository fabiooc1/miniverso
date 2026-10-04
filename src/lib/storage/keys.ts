/** Chaves geradas pelo storage: `2026/10/<uuid>.webp`. */
const FILE_KEY_PATTERN = /^\d{4}\/\d{2}\/[0-9a-f-]{36}\.(jpg|png|webp|avif|gif)$/;

export function isValidFileKey(key: string) {
  return FILE_KEY_PATTERN.test(key);
}

/**
 * Gera a chave de um novo arquivo. Todos os provedores usam o mesmo formato,
 * o que permite migrar arquivos entre eles mantendo as chaves salvas no banco.
 */
export function createFileKey(extension: string, date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${date.getFullYear()}/${month}/${crypto.randomUUID()}.${extension}`;
}

/**
 * URL pública de um arquivo. Fica separada do provedor para poder ser usada
 * em Client Components. `NEXT_PUBLIC_FILES_BASE_URL` é resolvida no
 * `next.config.ts` a partir do provedor configurado.
 */
export function getFileUrl(key: string) {
  const baseUrl = process.env.NEXT_PUBLIC_FILES_BASE_URL || "/uploads";
  return `${baseUrl}/${key}`;
}
