import { SupabaseFileStorage, getSupabaseStorageConfig } from "../../src/lib/storage/supabase-file-storage";

/** Com o Supabase Storage, cria o bucket público de imagens se ele não existir. */
export async function seedStorage() {
  if (process.env.STORAGE_PROVIDER !== "supabase") return;

  const config = getSupabaseStorageConfig();
  const created = await new SupabaseFileStorage(config).ensureBucket();
  console.log(created ? `Bucket criado: ${config.bucket}` : `Bucket já existe: ${config.bucket}`);
}
