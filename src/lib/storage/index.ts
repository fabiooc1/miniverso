import "server-only";

import path from "node:path";
import { LocalFileStorage } from "./local-file-storage";
import type { FileStorage } from "./types";

/** Ponto único de escolha do provedor de arquivos. */
export const storage: FileStorage = new LocalFileStorage(
  process.env.UPLOADS_DIR ?? path.join(process.cwd(), "uploads"),
);
