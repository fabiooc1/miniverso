"use client";

import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImagePreview } from "@/features/uploads/components/image-preview";
import { MediaPickerDialog } from "@/features/uploads/components/media-picker-dialog";
import { VideoEmbed } from "@/features/video/components/video-embed";
import { cn } from "@/lib/utils";
import type { MediaContent } from "../schemas/shared";
import { useEditableField } from "../editor/editor-context";

type EditableMediaProps = {
  path: string;
  value: MediaContent;
  /** Atributo `sizes` do next/image, conforme o layout da seção. */
  sizes: string;
  className?: string;
  priority?: boolean;
};

/** Imagem ou vídeo que preenche o contêiner pai (que deve ser `relative`). */
export function EditableMedia({ path, value, sizes, className, priority }: EditableMediaProps) {
  const field = useEditableField(path);

  const media =
    value.type === "video" ? (
      <VideoEmbed video={value.video} sizes={sizes} className={className} priority={priority} />
    ) : (
      <ImagePreview
        imageKey={value.image.key}
        alt={value.image.alt}
        sizes={sizes}
        priority={priority}
        className={className}
      />
    );

  if (!field) return media;

  // Erros podem vir do próprio campo ou de um filho (ex.: "media.image.alt").
  const error = field.error ?? field.childError;

  return (
    <>
      {media}
      <div
        data-invalid={Boolean(error)}
        className={cn(
          "absolute inset-0 flex items-center justify-center bg-brand-night/0 opacity-0 transition hover:bg-brand-night/40 hover:opacity-100 focus-within:opacity-100",
          "data-[invalid=true]:opacity-100 data-[invalid=true]:ring-4 data-[invalid=true]:ring-destructive data-[invalid=true]:ring-inset",
        )}
      >
        <MediaPickerDialog
          value={value}
          onChange={field.update}
          onUploaded={field.registerUpload}
          trigger={
            <Button variant="highlight" title={error}>
              <ImageIcon data-icon="inline-start" />
              Trocar mídia
            </Button>
          }
        />
      </div>
    </>
  );
}
