import "server-only";

import { fileTypeFromBuffer } from "file-type";
import { IMAGE_EXTENSIONS, IMAGE_MAX_BYTES } from "./images";

export type VerifiedImage = {
  bytes: Uint8Array;
  /** Tipo detectado pelo conteúdo do arquivo, nunca o informado pelo navegador. */
  contentType: string;
};

/**
 * Confere no servidor se o arquivo é mesmo uma imagem aceita, pela assinatura
 * binária (magic bytes), e não pela extensão ou pelo `type` enviado pelo
 * navegador, que podem ser forjados. Bloqueia, por exemplo, HTML, SVG ou
 * executáveis renomeados para `.png`.
 *
 * Não substitui um antivírus: valida o formato, não o conteúdo da imagem.
 */
export async function verifyImageFile(
  file: File,
): Promise<{ ok: true; image: VerifiedImage } | { ok: false; message: string }> {
  // Checa o tamanho declarado antes de ler o arquivo para a memória.
  if (file.size === 0) return { ok: false, message: "Selecione uma imagem." };
  if (file.size > IMAGE_MAX_BYTES) return { ok: false, message: "A imagem deve ter no máximo 5 MB." };

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (bytes.byteLength > IMAGE_MAX_BYTES) return { ok: false, message: "A imagem deve ter no máximo 5 MB." };

  const detected = await fileTypeFromBuffer(bytes);
  if (!detected || !(detected.mime in IMAGE_EXTENSIONS)) {
    return { ok: false, message: "O arquivo não é uma imagem válida. Use JPG, PNG, WebP, AVIF ou GIF." };
  }

  return { ok: true, image: { bytes, contentType: detected.mime } };
}
