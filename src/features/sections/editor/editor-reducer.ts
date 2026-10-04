import type { SectionEntry, SectionKey } from "../definitions";
import { setIn, type FieldPath } from "../lib/path";

export type EditorState = {
  sections: SectionEntry[];
  /** Última versão salva, usada para descartar e detectar alterações. */
  saved: SectionEntry[];
  errors: Record<string, string>;
  /** Uploads feitos desde o último salvamento. */
  pendingUploads: string[];
};

export type EditorAction =
  | { type: "updateField"; sectionKey: SectionKey; path: FieldPath; value: unknown }
  | { type: "move"; sectionKey: SectionKey; offset: -1 | 1 }
  | { type: "toggleVisible"; sectionKey: SectionKey }
  | { type: "registerUpload"; key: string }
  | { type: "setErrors"; errors: Record<string, string> }
  | { type: "saved"; sections: SectionEntry[] }
  | { type: "discard" };

export function createEditorState(sections: SectionEntry[]): EditorState {
  return { sections, saved: sections, errors: {}, pendingUploads: [] };
}

function withoutErrorsFor(errors: Record<string, string>, prefix: string) {
  return Object.fromEntries(Object.entries(errors).filter(([key]) => !key.startsWith(prefix)));
}

export function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "updateField": {
      const sections = state.sections.map((section) =>
        section.key === action.sectionKey
          ? { ...section, content: setIn(section.content, action.path, action.value) }
          : section,
      );
      // Editar um campo limpa o erro dele (e dos filhos, no caso de listas).
      const errors = withoutErrorsFor(state.errors, `${action.sectionKey}.${action.path}`);
      return { ...state, sections, errors };
    }

    case "move": {
      const index = state.sections.findIndex((section) => section.key === action.sectionKey);
      const target = index + action.offset;
      if (index < 0 || target < 0 || target >= state.sections.length) return state;

      const sections = [...state.sections];
      [sections[index], sections[target]] = [sections[target], sections[index]];
      return { ...state, sections };
    }

    case "toggleVisible":
      return {
        ...state,
        sections: state.sections.map((section) =>
          section.key === action.sectionKey ? { ...section, visible: !section.visible } : section,
        ),
      };

    case "registerUpload":
      return { ...state, pendingUploads: [...state.pendingUploads, action.key] };

    case "setErrors":
      return { ...state, errors: action.errors };

    case "saved":
      return createEditorState(action.sections);

    case "discard":
      return createEditorState(state.saved);
  }
}
