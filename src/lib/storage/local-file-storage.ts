import "server-only";

import { createReadStream } from "node:fs";
import { mkdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { IMAGE_EXTENSIONS } from "./images";
import { createFileKey, isValidFileKey } from "./keys";
import type { FileStorage, StoredFile } from "./types";

const CONTENT_TYPES = Object.fromEntries(
  Object.entries(IMAGE_EXTENSIONS).map(([type, extension]) => [extension, type]),
);

/**
 * Guarda os arquivos em disco (padrão: `<projeto>/uploads`). Exige disco
 * persistente e gravável, o que as funções da Vercel não oferecem.
 */
export class LocalFileStorage implements FileStorage {
  constructor(private readonly rootDir: string) {}

  async save(file: File) {
    const extension = IMAGE_EXTENSIONS[file.type];
    if (!extension) {
      throw new Error(`Tipo de arquivo não suportado: ${file.type}`);
    }

    const key = createFileKey(extension);
    const filePath = this.resolve(key);

    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, Buffer.from(await file.arrayBuffer()));

    return { key };
  }

  async read(key: string): Promise<StoredFile | null> {
    if (!isValidFileKey(key)) return null;

    const filePath = this.resolve(key);
    try {
      const { size } = await stat(filePath);
      const extension = path.extname(key).slice(1);
      return {
        body: Readable.toWeb(createReadStream(filePath)) as ReadableStream<Uint8Array>,
        contentType: CONTENT_TYPES[extension] ?? "application/octet-stream",
        size,
      };
    } catch {
      return null;
    }
  }

  async delete(key: string) {
    if (!isValidFileKey(key)) return;
    await rm(this.resolve(key), { force: true });
  }

  private resolve(key: string) {
    return path.join(this.rootDir, key);
  }
}
