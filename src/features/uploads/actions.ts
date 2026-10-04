"use server";

import { requireAdmin } from "@/features/auth/session";
import { actionError, type ActionResult } from "@/lib/action-result";
import { getStorage } from "@/lib/storage";
import { verifyImageFile } from "@/lib/storage/image-validation";
import { isValidFileKey } from "@/lib/storage/keys";
import { findReferencedFileKeys } from "./references";

export async function uploadImage(formData: FormData): Promise<ActionResult<{ key: string }>> {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return actionError("Selecione uma imagem.");
  }

  const verification = await verifyImageFile(file);
  if (!verification.ok) return actionError(verification.message);

  const { key } = await getStorage().save(verification.image);
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
    candidates.filter((key) => !referenced.has(key)).map((key) => getStorage().delete(key)),
  );
}
