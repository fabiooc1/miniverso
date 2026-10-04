"use server";

import { requireAdmin } from "@/features/auth/session";
import { actionError, type ActionResult } from "@/lib/action-result";
import { storage } from "@/lib/storage";
import { validateImageFile } from "@/lib/storage/images";
import { isValidFileKey } from "@/lib/storage/keys";
import { findReferencedFileKeys } from "./references";

export async function uploadImage(formData: FormData): Promise<ActionResult<{ key: string }>> {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return actionError("Selecione uma imagem.");
  }

  const error = validateImageFile(file);
  if (error) return actionError(error);

  const { key } = await storage.save(file);
  return { ok: true, data: { key } };
}

/**
 * Remove uploads feitos durante uma edição que foi descartada. Só apaga
 * arquivos que não estão referenciados em nenhum conteúdo salvo.
 */
export async function discardUploads(keys: string[]) {
  await requireAdmin();

  const candidates = keys.filter(isValidFileKey);
  if (candidates.length === 0) return;

  const referenced = await findReferencedFileKeys(candidates);
  await Promise.all(
    candidates.filter((key) => !referenced.has(key)).map((key) => storage.delete(key)),
  );
}
