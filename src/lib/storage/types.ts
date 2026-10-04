export type StoredFile = {
  body: ReadableStream<Uint8Array>;
  contentType: string;
  size: number;
};

/** Arquivo já validado, pronto para ser guardado. */
export type FileUpload = {
  bytes: Uint8Array;
  contentType: string;
};

/**
 * Contrato do armazenamento de arquivos. Os consumidores dependem apenas desta
 * interface, o que permite trocar o provedor (disco local, S3, Supabase
 * Storage...) sem alterar quem salva ou lê arquivos.
 */
export interface FileStorage {
  save(file: FileUpload): Promise<{ key: string }>;
  read(key: string): Promise<StoredFile | null>;
  delete(key: string): Promise<void>;
}
