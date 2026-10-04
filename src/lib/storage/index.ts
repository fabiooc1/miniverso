import "server-only";

import path from "node:path";
import { LocalFileStorage } from "./local-file-storage";
import { SupabaseFileStorage, getSupabaseStorageConfig } from "./supabase-file-storage";
import type { FileStorage } from "./types";

function createStorage(): FileStorage {
  switch (process.env.STORAGE_PROVIDER ?? "local") {
    case "supabase":
      return new SupabaseFileStorage(getSupabaseStorageConfig());
    case "local":
      return new LocalFileStorage(process.env.UPLOADS_DIR ?? path.join(process.cwd(), "uploads"));
    default:
      throw new Error(`STORAGE_PROVIDER inválido: "${process.env.STORAGE_PROVIDER}". Use "local" ou "supabase".`);
  }
}

let instance: FileStorage | undefined;

/**
 * Ponto único de escolha do provedor de arquivos (`STORAGE_PROVIDER`).
 * Consumidores dependem apenas da interface `FileStorage`. A criação é
 * preguiçosa: configuração ausente só gera erro ao usar o storage, sem
 * derrubar as páginas que importam este módulo.
 */
export function getStorage(): FileStorage {
  instance ??= createStorage();
  return instance;
}
