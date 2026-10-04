export type StoredFile = {
  body: ReadableStream<Uint8Array>;
  contentType: string;
  size: number;
};

/**
 * Contrato do armazenamento de arquivos. Os consumidores dependem apenas desta
 * interface, o que permite trocar o provedor (disco local, S3, Supabase
 * Storage...) sem alterar quem salva ou lê arquivos.
 */
export interface FileStorage {
  save(file: File): Promise<{ key: string }>;
  read(key: string): Promise<StoredFile | null>;
  delete(key: string): Promise<void>;
}
