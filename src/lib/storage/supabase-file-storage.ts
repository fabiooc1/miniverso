import { StorageClient } from "@supabase/storage-js";
import { IMAGE_EXTENSIONS, IMAGE_MAX_BYTES } from "./images";
import { createFileKey, isValidFileKey } from "./keys";
import type { FileStorage, StoredFile } from "./types";

type SupabaseStorageConfig = {
  /** URL do projeto: `https://<projeto>.supabase.co`. */
  url: string;
  /** Chave `service_role`: só no servidor, nunca com prefixo NEXT_PUBLIC_. */
  serviceRoleKey: string;
  bucket: string;
};

/**
 * Guarda os arquivos num bucket público do Supabase Storage. A leitura pública
 * é feita direto pela CDN do Supabase (ver `getFileUrl`); escrita e remoção
 * usam a chave de serviço.
 *
 * Sem `server-only` de propósito, para o seed poder criar o bucket. A aplicação
 * deve importar o storage apenas por `@/lib/storage`, que é exclusivo do servidor.
 */
export class SupabaseFileStorage implements FileStorage {
  private readonly client: StorageClient;

  constructor(private readonly config: SupabaseStorageConfig) {
    this.client = new StorageClient(`${config.url.replace(/\/$/, "")}/storage/v1`, {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
    });
  }

  private get bucket() {
    return this.client.from(this.config.bucket);
  }

  async save(file: File) {
    const extension = IMAGE_EXTENSIONS[file.type];
    if (!extension) {
      throw new Error(`Tipo de arquivo não suportado: ${file.type}`);
    }

    const key = createFileKey(extension);
    // Binário direto (em vez de multipart): tipo e cache vão nos headers.
    const { error } = await this.bucket.upload(key, await file.arrayBuffer(), {
      contentType: file.type,
      // As chaves são únicas (uuid), então o conteúdo nunca muda.
      cacheControl: "31536000",
      upsert: false,
    });
    if (error) throw new Error(`Falha ao enviar arquivo ao Supabase: ${error.message}`);

    return { key };
  }

  async read(key: string): Promise<StoredFile | null> {
    if (!isValidFileKey(key)) return null;

    const { data, error } = await this.bucket.download(key);
    if (error || !data) return null;

    return { body: data.stream(), contentType: data.type, size: data.size };
  }

  async delete(key: string) {
    if (!isValidFileKey(key)) return;

    const { error } = await this.bucket.remove([key]);
    if (error) throw new Error(`Falha ao remover arquivo do Supabase: ${error.message}`);
  }

  /** Cria o bucket público, se ainda não existir. Usado pelo seed. */
  async ensureBucket() {
    const { data } = await this.client.getBucket(this.config.bucket);
    if (data) return false;

    const { error } = await this.client.createBucket(this.config.bucket, {
      public: true,
      fileSizeLimit: IMAGE_MAX_BYTES,
      allowedMimeTypes: Object.keys(IMAGE_EXTENSIONS),
    });
    if (error) throw new Error(`Falha ao criar o bucket "${this.config.bucket}": ${error.message}`);
    return true;
  }
}

/** Lê a configuração do Supabase Storage do ambiente. */
export function getSupabaseStorageConfig(): SupabaseStorageConfig {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET;

  if (!url || !serviceRoleKey || !bucket) {
    throw new Error(
      "Configure SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY e SUPABASE_STORAGE_BUCKET no .env para usar o Supabase Storage.",
    );
  }
  return { url, serviceRoleKey, bucket };
}
