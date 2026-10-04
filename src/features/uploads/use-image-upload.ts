"use client";

import { useState } from "react";
import { toast } from "sonner";
import { validateImageFile } from "@/lib/storage/images";
import { uploadImage } from "./actions";

/** Envia uma imagem ao servidor e devolve a chave gerada pelo storage. */
export function useImageUpload(onUploaded?: (key: string) => void) {
  const [isUploading, setIsUploading] = useState(false);

  async function upload(file: File): Promise<string | null> {
    const error = validateImageFile(file);
    if (error) {
      toast.error(error);
      return null;
    }

    const formData = new FormData();
    formData.set("file", file);

    setIsUploading(true);
    try {
      const result = await uploadImage(formData);
      if (!result.ok || !result.data) {
        toast.error(result.ok ? "Não foi possível enviar a imagem." : result.message);
        return null;
      }
      onUploaded?.(result.data.key);
      return result.data.key;
    } catch {
      toast.error("Não foi possível enviar a imagem. Tente novamente.");
      return null;
    } finally {
      setIsUploading(false);
    }
  }

  return { upload, isUploading };
}
