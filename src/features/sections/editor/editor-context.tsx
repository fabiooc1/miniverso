"use client";

import { createContext, use } from "react";
import type { z } from "zod";
import type { SectionKey } from "../definitions";
import type { FieldPath } from "../lib/path";

export type EditorContextValue = {
  getContent: (sectionKey: SectionKey) => unknown;
  updateField: (sectionKey: SectionKey, path: FieldPath, value: unknown) => void;
  /** Erros de validação por `"<seção>.<caminho>"`. */
  errors: Record<string, string>;
  /** Registra uploads ainda não salvos, para limpá-los ao descartar. */
  registerUpload: (key: string) => void;
};

export const EditorContext = createContext<EditorContextValue | null>(null);

type SectionScope = { sectionKey: SectionKey; schema: z.ZodType };

export const SectionScopeContext = createContext<SectionScope | null>(null);

/**
 * Dados de edição de um campo da seção atual. Retorna `null` fora do editor,
 * e os componentes editáveis renderizam o elemento comum nesse caso.
 */
export function useEditableField(path: FieldPath) {
  const editor = use(EditorContext);
  const scope = use(SectionScopeContext);
  if (!editor || !scope) return null;

  const { sectionKey, schema } = scope;
  const prefix = `${sectionKey}.${path}`;
  return {
    sectionKey,
    schema,
    path,
    error: editor.errors[prefix],
    /** Primeiro erro de um campo filho (ex.: "image.alt" dentro de uma mídia). */
    childError: Object.entries(editor.errors).find(([key]) => key.startsWith(`${prefix}.`))?.[1],
    content: editor.getContent(sectionKey),
    update: (value: unknown) => editor.updateField(sectionKey, path, value),
    registerUpload: editor.registerUpload,
  };
}

export type EditableField = NonNullable<ReturnType<typeof useEditableField>>;

/** Indica se o componente está dentro do editor visual. */
export function useIsEditing() {
  return use(EditorContext) !== null;
}
