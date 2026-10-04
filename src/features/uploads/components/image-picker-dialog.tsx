"use client";

import { useId, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useImageUpload } from "../use-image-upload";
import { ImageFileButton } from "./image-file-button";
import { ImagePreview } from "./image-preview";

export type ImageValue = { key: string; alt: string };

type ImagePickerDialogProps = {
  value: ImageValue;
  onChange: (value: ImageValue) => void;
  onUploaded?: (key: string) => void;
  trigger: ReactNode;
  title?: string;
};

/** Diálogo para trocar uma imagem: upload, prévia e texto alternativo. */
export function ImagePickerDialog({
  value,
  onChange,
  onUploaded,
  trigger,
  title = "Trocar imagem",
}: ImagePickerDialogProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const { upload, isUploading } = useImageUpload(onUploaded);
  const altId = useId();

  const altMissing = Boolean(draft.key) && !draft.alt.trim();

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) setDraft(value);
    setOpen(nextOpen);
  }

  async function handleSelect(file: File) {
    const key = await upload(file);
    if (key) setDraft((current) => ({ ...current, key }));
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>JPG, PNG, WebP, AVIF ou GIF com até 5 MB.</DialogDescription>
        </DialogHeader>

        <div className="relative aspect-video overflow-hidden rounded-xl border">
          <ImagePreview imageKey={draft.key} alt={draft.alt} sizes="512px" />
        </div>

        <FieldGroup>
          <ImageFileButton isUploading={isUploading} onSelect={handleSelect} />
          <Field data-invalid={altMissing}>
            <FieldLabel htmlFor={altId}>Texto alternativo</FieldLabel>
            <Input
              id={altId}
              value={draft.alt}
              maxLength={200}
              aria-invalid={altMissing}
              onChange={(event) => setDraft((current) => ({ ...current, alt: event.target.value }))}
            />
            {altMissing ? (
              <FieldError>Descreva a imagem para leitores de tela.</FieldError>
            ) : (
              <FieldDescription>Descreva o que aparece na imagem.</FieldDescription>
            )}
          </Field>
        </FieldGroup>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button
            disabled={isUploading || altMissing}
            onClick={() => {
              onChange({ key: draft.key, alt: draft.alt.trim() });
              setOpen(false);
            }}
          >
            Aplicar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
