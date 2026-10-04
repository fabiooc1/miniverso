"use client";

import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImagePickerDialog } from "@/features/uploads/components/image-picker-dialog";
import { ImagePreview } from "@/features/uploads/components/image-preview";
import { cn } from "@/lib/utils";
import type { ImageContent } from "../schemas/shared";
import { useEditableField } from "../editor/editor-context";

type EditableImageProps = {
  path: string;
  value: ImageContent;
  /** Atributo `sizes` do next/image, conforme o layout da seção. */
  sizes: string;
  className?: string;
  priority?: boolean;
};

/** Imagem que preenche o contêiner pai (que deve ser `relative`). */
export function EditableImage({ path, value, sizes, className, priority }: EditableImageProps) {
  const field = useEditableField(path);
  const preview = (
    <ImagePreview
      imageKey={value.key}
      alt={value.alt}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );

  if (!field) return preview;

  return (
    <>
      {preview}
      <div
        data-invalid={Boolean(field.error)}
        className={cn(
          "absolute inset-0 flex items-center justify-center bg-brand-night/0 opacity-0 transition hover:bg-brand-night/40 hover:opacity-100 focus-within:opacity-100",
          "data-[invalid=true]:opacity-100 data-[invalid=true]:ring-4 data-[invalid=true]:ring-destructive data-[invalid=true]:ring-inset",
        )}
      >
        <ImagePickerDialog
          value={value}
          onChange={field.update}
          onUploaded={field.registerUpload}
          trigger={
            <Button variant="highlight" title={field.error}>
              <ImageIcon data-icon="inline-start" />
              Trocar imagem
            </Button>
          }
        />
      </div>
    </>
  );
}
