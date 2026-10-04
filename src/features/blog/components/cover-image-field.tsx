"use client";

import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ImageFileButton } from "@/features/uploads/components/image-file-button";
import { ImagePreview } from "@/features/uploads/components/image-preview";
import { useImageUpload } from "@/features/uploads/use-image-upload";

type CoverImageFieldProps = {
  imageKey: string;
  alt: string;
  onImageChange: (key: string) => void;
  onAltChange: (alt: string) => void;
  onUploaded: (key: string) => void;
  errors: { image?: string; alt?: string };
};

export function CoverImageField({ imageKey, alt, onImageChange, onAltChange, onUploaded, errors }: CoverImageFieldProps) {
  const { upload, isUploading } = useImageUpload(onUploaded);

  return (
    <FieldGroup>
      <Field data-invalid={Boolean(errors.image)}>
        <div className="relative aspect-video overflow-hidden rounded-xl border">
          <ImagePreview imageKey={imageKey} alt={alt} sizes="320px" />
        </div>
        <ImageFileButton
          isUploading={isUploading}
          aria-invalid={Boolean(errors.image)}
          onSelect={async (file) => {
            const key = await upload(file);
            if (key) onImageChange(key);
          }}
        >
          {imageKey ? "Trocar imagem" : "Escolher imagem"}
        </ImageFileButton>
        <FieldError>{errors.image}</FieldError>
      </Field>
      <Field data-invalid={Boolean(errors.alt)}>
        <FieldLabel htmlFor="cover-alt">Texto alternativo</FieldLabel>
        <Input
          id="cover-alt"
          value={alt}
          maxLength={200}
          aria-invalid={Boolean(errors.alt)}
          onChange={(event) => onAltChange(event.target.value)}
        />
        {errors.alt ? (
          <FieldError>{errors.alt}</FieldError>
        ) : (
          <FieldDescription>Descreva a imagem para leitores de tela.</FieldDescription>
        )}
      </Field>
    </FieldGroup>
  );
}
