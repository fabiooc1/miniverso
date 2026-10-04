"use client";

import { UploadIcon } from "lucide-react";
import { useRef, type ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { IMAGE_ACCEPT } from "@/lib/storage/images";

type ImageFileButtonProps = Omit<ComponentProps<typeof Button>, "onClick" | "onSelect"> & {
  isUploading: boolean;
  onSelect: (file: File) => void;
};

/** Botão que abre o seletor de arquivos de imagem. */
export function ImageFileButton({ isUploading, onSelect, children, ...props }: ImageFileButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_ACCEPT}
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onSelect(file);
          event.target.value = "";
        }}
      />
      <Button
        type="button"
        variant="outline"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
        {...props}
      >
        {isUploading ? <Spinner data-icon="inline-start" /> : <UploadIcon data-icon="inline-start" />}
        {isUploading ? "Enviando…" : (children ?? "Escolher imagem")}
      </Button>
    </>
  );
}
