"use client";

import { SearchIcon } from "lucide-react";
import Image from "next/image";
import { useId, useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { resolveVideo } from "../actions";
import { getVideoWatchUrl, VIDEO_PROVIDER_LABELS, type VideoContent } from "../video";

type VideoLinkFormProps = {
  value: VideoContent | null;
  onChange: (video: VideoContent | null) => void;
};

/** Campo para colar o link do vídeo, com prévia e título editável. */
export function VideoLinkForm({ value, onChange }: VideoLinkFormProps) {
  const [url, setUrl] = useState(value ? getVideoWatchUrl(value) : "");
  const [error, setError] = useState<string>();
  const [isResolving, startResolving] = useTransition();
  const urlId = useId();
  const titleId = useId();

  function resolve() {
    if (!url.trim()) return;
    startResolving(async () => {
      const result = await resolveVideo(url);
      if (!result.ok || !result.data) {
        setError(result.ok ? "Não foi possível obter o vídeo." : result.message);
        return;
      }
      setError(undefined);
      onChange(result.data);
    });
  }

  return (
    <FieldGroup>
      <Field data-invalid={Boolean(error)}>
        <FieldLabel htmlFor={urlId}>Link do vídeo</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id={urlId}
            type="url"
            value={url}
            placeholder="https://www.youtube.com/watch?v=…"
            aria-invalid={Boolean(error)}
            onChange={(event) => setUrl(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                resolve();
              }
            }}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton disabled={isResolving || !url.trim()} onClick={resolve}>
              {isResolving ? <Spinner data-icon="inline-start" /> : <SearchIcon data-icon="inline-start" />}
              Buscar
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        {error ? (
          <FieldError>{error}</FieldError>
        ) : (
          <FieldDescription>YouTube ou Vimeo. O vídeo fica hospedado lá, sem ocupar o armazenamento do site.</FieldDescription>
        )}
      </Field>

      {value && (
        <>
          <div className="relative aspect-video overflow-hidden rounded-xl border bg-black">
            <Image src={value.thumbnailUrl} alt="" fill sizes="512px" className="object-cover" />
            <Badge className="absolute top-3 left-3">{VIDEO_PROVIDER_LABELS[value.provider]}</Badge>
          </div>
          <Field>
            <FieldLabel htmlFor={titleId}>Título do vídeo</FieldLabel>
            <Input
              id={titleId}
              value={value.title}
              maxLength={200}
              onChange={(event) => onChange({ ...value, title: event.target.value })}
            />
            <FieldDescription>Usado por leitores de tela no botão de reproduzir.</FieldDescription>
          </Field>
        </>
      )}
    </FieldGroup>
  );
}
