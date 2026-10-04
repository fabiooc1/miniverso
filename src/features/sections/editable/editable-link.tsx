"use client";

import { LinkIcon } from "lucide-react";
import { useId, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { LinkContent } from "../schemas/shared";
import { useEditableField } from "../editor/editor-context";
import { EditableText } from "./editable-text";

type EditableLinkProps = {
  /** Caminho de um objeto `{ label, href }`. */
  path: string;
  value: LinkContent;
  className?: string;
  /** Conteúdo após o texto, como um ícone. */
  children?: ReactNode;
};

function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

export function EditableLink({ path, value, className, children }: EditableLinkProps) {
  const field = useEditableField(`${path}.href`);

  if (!field) {
    const external = isExternal(value.href);
    return (
      <a
        href={value.href}
        className={className}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {value.label}
        {children}
      </a>
    );
  }

  return (
    <span className={cn(className, "relative")}>
      <EditableText path={`${path}.label`} value={value.label} />
      {children}
      <HrefPopover href={value.href} error={field.error} onChange={field.update} />
    </span>
  );
}

type EditableLinkAreaProps = {
  /** Caminho de um campo `href` (string; vazio = sem link). */
  path: string;
  href: string;
  className?: string;
  children: ReactNode;
};

/**
 * Área clicável (ex.: card de projeto). Fora do editor vira `<a>` quando há
 * link; no editor vira um `<div>`, para não navegar ao editar o conteúdo.
 */
export function EditableLinkArea({ path, href, className, children }: EditableLinkAreaProps) {
  const field = useEditableField(path);

  if (!field) {
    if (!href) return <div className={className}>{children}</div>;
    const external = isExternal(href);
    return (
      <a
        href={href}
        className={className}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <div className={cn(className, "relative")}>
      {children}
      <HrefPopover href={href} error={field.error} onChange={field.update} optional />
    </div>
  );
}

function HrefPopover({
  href,
  error,
  onChange,
  optional = false,
}: {
  href: string;
  error?: string;
  onChange: (href: string) => void;
  optional?: boolean;
}) {
  const inputId = useId();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon-xs"
          variant={error ? "destructive" : "inverted"}
          // Canto inferior: o superior é usado pela barra de itens de lista.
          className="absolute -right-3 -bottom-3 z-20 shadow-sm"
          aria-label="Editar link"
        >
          <LinkIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <Field data-invalid={Boolean(error)}>
          <FieldLabel htmlFor={inputId}>Destino do link</FieldLabel>
          <Input
            id={inputId}
            value={href}
            maxLength={300}
            aria-invalid={Boolean(error)}
            placeholder="https://… ou #contato"
            onChange={(event) => onChange(event.target.value)}
          />
          {error ? (
            <FieldError>{error}</FieldError>
          ) : (
            <FieldDescription>
              Use https://, mailto:, tel:, /caminho ou #ancora.
              {optional && " Deixe vazio para não ter link."}
            </FieldDescription>
          )}
        </Field>
      </PopoverContent>
    </Popover>
  );
}
