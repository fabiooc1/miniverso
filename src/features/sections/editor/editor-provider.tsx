"use client";

import { useCallback, useEffect, useMemo, useReducer, type ReactNode } from "react";
import type { SectionEntry, SectionKey } from "../definitions";
import type { FieldPath } from "../lib/path";
import { EditorContext, type EditorContextValue } from "./editor-context";
import { createEditorState, editorReducer } from "./editor-reducer";

export function useLandingEditorState(initialSections: SectionEntry[]) {
  const [state, dispatch] = useReducer(editorReducer, initialSections, createEditorState);

  // Comparação estrutural simples: o conteúdo da landing é pequeno.
  const isDirty = useMemo(
    () => JSON.stringify(state.sections) !== JSON.stringify(state.saved),
    [state.sections, state.saved],
  );

  useEffect(() => {
    if (!isDirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);

  return { state, dispatch, isDirty };
}

type EditorProviderProps = {
  sections: SectionEntry[];
  errors: Record<string, string>;
  onUpdateField: (sectionKey: SectionKey, path: FieldPath, value: unknown) => void;
  onUpload: (key: string) => void;
  children: ReactNode;
};

/** Disponibiliza o rascunho para os componentes editáveis das seções. */
export function EditorProvider({ sections, errors, onUpdateField, onUpload, children }: EditorProviderProps) {
  const getContent = useCallback(
    (sectionKey: SectionKey) => sections.find((section) => section.key === sectionKey)?.content,
    [sections],
  );

  const value = useMemo<EditorContextValue>(
    () => ({ getContent, updateField: onUpdateField, errors, registerUpload: onUpload }),
    [getContent, onUpdateField, errors, onUpload],
  );

  return <EditorContext value={value}>{children}</EditorContext>;
}
