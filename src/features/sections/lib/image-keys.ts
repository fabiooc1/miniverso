import { isValidFileKey } from "@/lib/storage/keys";

/**
 * Percorre o JSON de uma seção e coleta as chaves de imagens (`{ key, alt }`).
 * Usado para remover arquivos que deixaram de ser referenciados.
 */
export function collectImageKeys(value: unknown, keys = new Set<string>()): Set<string> {
  if (Array.isArray(value)) {
    for (const item of value) collectImageKeys(item, keys);
  } else if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record.key === "string" && "alt" in record && isValidFileKey(record.key)) {
      keys.add(record.key);
    }
    for (const nested of Object.values(record)) collectImageKeys(nested, keys);
  }
  return keys;
}
