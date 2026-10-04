"use client";

import { ImageIcon, VideoIcon } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoLinkForm } from "@/features/video/components/video-link-form";
import type { VideoContent } from "@/features/video/video";
import { useImageUpload } from "../use-image-upload";
import { ImageFileButton } from "./image-file-button";
import { ImagePreview } from "./image-preview";

export type MediaValue =
  | { type: "image"; image: { key: string; alt: string } }
  | { type: "video"; video: VideoContent };

type MediaPickerDialogProps = {
  value: MediaValue;
  onChange: (value: MediaValue) => void;
  onUploaded?: (key: string) => void;
  trigger: ReactNode;
};

/** Troca a mídia de um ponto da página: imagem enviada ou vídeo por link. */
export function MediaPickerDialog({ value, onChange, onUploaded, trigger }: MediaPickerDialogProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<MediaValue["type"]>(value.type);
  const [image, setImage] = useState(value.type === "image" ? value.image : { key: "", alt: "" });
  const [video, setVideo] = useState<VideoContent | null>(value.type === "video" ? value.video : null);
  const { upload, isUploading } = useImageUpload(onUploaded);
  const altId = useId();

  const altMissing = Boolean(image.key) && !image.alt.trim();
  const canApply = tab === "image" ? !isUploading && !altMissing : Boolean(video?.title.trim());

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setTab(value.type);
      setImage(value.type === "image" ? value.image : { key: "", alt: "" });
      setVideo(value.type === "video" ? value.video : null);
    }
    setOpen(nextOpen);
  }

  function apply() {
    if (tab === "image") {
      onChange({ type: "image", image: { key: image.key, alt: image.alt.trim() } });
    } else if (video) {
      onChange({ type: "video", video: { ...video, title: video.title.trim() } });
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Trocar mídia</DialogTitle>
          <DialogDescription>Envie uma imagem ou use um vídeo do YouTube ou do Vimeo.</DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(next) => setTab(next as MediaValue["type"])}>
          <TabsList className="w-full">
            <TabsTrigger value="image">
              <ImageIcon />
              Imagem
            </TabsTrigger>
            <TabsTrigger value="video">
              <VideoIcon />
              Vídeo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="image" className="flex flex-col gap-4 pt-2">
            <div className="relative aspect-video overflow-hidden rounded-xl border">
              <ImagePreview imageKey={image.key} alt={image.alt} sizes="512px" />
            </div>
            <FieldGroup>
              <ImageFileButton
                isUploading={isUploading}
                onSelect={async (file) => {
                  const key = await upload(file);
                  if (key) setImage((current) => ({ ...current, key }));
                }}
              />
              <Field data-invalid={altMissing}>
                <FieldLabel htmlFor={altId}>Texto alternativo</FieldLabel>
                <Input
                  id={altId}
                  value={image.alt}
                  maxLength={200}
                  aria-invalid={altMissing}
                  onChange={(event) => setImage((current) => ({ ...current, alt: event.target.value }))}
                />
                {altMissing ? (
                  <FieldError>Descreva a imagem para leitores de tela.</FieldError>
                ) : (
                  <FieldDescription>JPG, PNG, WebP, AVIF ou GIF com até 5 MB.</FieldDescription>
                )}
              </Field>
            </FieldGroup>
          </TabsContent>

          <TabsContent value="video" className="pt-2">
            <VideoLinkForm value={video} onChange={setVideo} />
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button disabled={!canApply} onClick={apply}>
            Aplicar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
