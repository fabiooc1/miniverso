"use client";

import { useLayoutEffect, useRef, type ElementType, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { useEditableField, type EditableField } from "../editor/editor-context";
import { getMaxLength } from "../lib/schema-introspection";
import { editableOutline } from "./styles";

type EditableTextProps = {
  path: string;
  value: string;
  as?: ElementType;
  className?: string;
  /** Permite quebras de linha (Enter). */
  multiline?: boolean;
  placeholder?: string;
};

export function EditableText({ as: Tag = "span", path, value, className, ...props }: EditableTextProps) {
  const field = useEditableField(path);

  if (!field) {
    return value ? <Tag className={className}>{value}</Tag> : null;
  }

  return <EditableTextInput as={Tag} field={field} value={value} className={className} {...props} />;
}

function EditableTextInput({
  as: Tag,
  field,
  value,
  className,
  multiline = false,
  placeholder = "Digite aqui…",
}: Omit<EditableTextProps, "path"> & { as: ElementType; field: EditableField }) {
  const ref = useRef<HTMLElement>(null);
  const maxLength = getMaxLength(field.schema, field.path);

  // O elemento não é controlado pelo React enquanto o usuário digita (o que
  // moveria o cursor). Só sincronizamos quando o valor muda por fora, como
  // ao descartar alterações.
  useLayoutEffect(() => {
    const element = ref.current;
    if (element && element.innerText !== value) element.innerText = value;
  }, [value]);

  function handleInput() {
    const element = ref.current;
    if (!element) return;

    let text = element.innerText;
    if (!multiline) text = text.replace(/\n/g, " ");
    if (maxLength && text.length > maxLength) {
      text = text.slice(0, maxLength);
      element.innerText = text;
      placeCaretAtEnd(element);
    }
    field.update(text);
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" && !multiline) event.preventDefault();
  }

  return (
    <Tag
      ref={ref}
      contentEditable="plaintext-only"
      suppressContentEditableWarning
      role="textbox"
      aria-multiline={multiline}
      aria-invalid={Boolean(field.error)}
      aria-label={placeholder}
      data-invalid={Boolean(field.error)}
      data-placeholder={placeholder}
      title={field.error ?? (maxLength ? `Até ${maxLength} caracteres` : undefined)}
      spellCheck
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      className={cn(
        className,
        editableOutline,
        "cursor-text whitespace-pre-line empty:before:text-current/40 empty:before:content-[attr(data-placeholder)]",
      )}
    />
  );
}

function placeCaretAtEnd(element: HTMLElement) {
  const selection = window.getSelection();
  if (!selection) return;
  const range = document.createRange();
  range.selectNodeContents(element);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}
