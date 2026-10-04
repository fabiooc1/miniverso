"use client";

import { useCallback, useTransition } from "react";
import { CircleAlertIcon } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { discardUploads } from "@/features/uploads/actions";
import { saveLandingSections } from "../actions";
import { SiteHeader } from "../components/site-header";
import { SectionRenderer } from "../components/section-renderer";
import { sectionDefinitions, type SectionEntry, type SectionKey } from "../definitions";
import type { FieldPath } from "../lib/path";
import { EditorProvider, useLandingEditorState } from "./editor-provider";
import { EditorToolbar } from "./editor-toolbar";
import { SectionFrame } from "./section-frame";
import { SectionsPanel } from "./sections-panel";

/**
 * Editor visual da landing: renderiza uma cópia da página com os mesmos
 * componentes do site, com pontos editáveis. Nada é gravado até "Salvar".
 */
export function LandingEditor({ initialSections }: { initialSections: SectionEntry[] }) {
  const { state, dispatch, isDirty } = useLandingEditorState(initialSections);
  const [isSaving, startSaving] = useTransition();

  // Seções cujo conteúdo salvo não passou na validação e aparecem com os
  // valores padrão: salvar agora apagaria o conteúdo real.
  const invalidSections = initialSections
    .filter((section) => section.invalidContent)
    .map((section) => sectionDefinitions[section.key].label);

  const movableCount = state.sections.filter((section) => !("fixed" in sectionDefinitions[section.key])).length;

  const updateField = useCallback(
    (sectionKey: SectionKey, path: FieldPath, value: unknown) =>
      dispatch({ type: "updateField", sectionKey, path, value }),
    [dispatch],
  );
  const registerUpload = useCallback((key: string) => dispatch({ type: "registerUpload", key }), [dispatch]);
  const move = (sectionKey: SectionKey, offset: -1 | 1) => dispatch({ type: "move", sectionKey, offset });
  const toggleVisible = (sectionKey: SectionKey) => dispatch({ type: "toggleVisible", sectionKey });

  function save() {
    startSaving(async () => {
      const result = await saveLandingSections(state.sections);
      if (!result.ok) {
        dispatch({ type: "setErrors", errors: result.fieldErrors ?? {} });
        toast.error(result.message);
        return;
      }
      dispatch({ type: "saved", sections: result.data ?? state.sections });
      toast.success(result.message);
    });
  }

  function discard() {
    const pendingUploads = state.pendingUploads;
    dispatch({ type: "discard" });
    if (pendingUploads.length > 0) void discardUploads(pendingUploads);
  }

  const sectionsPanel = (
    <SectionsPanel
      sections={state.sections}
      movableCount={movableCount}
      onMove={move}
      onToggleVisible={toggleVisible}
    />
  );

  return (
    <div className="flex flex-1 flex-col">
      <EditorToolbar
        isDirty={isDirty}
        isSaving={isSaving}
        errors={state.errors}
        onSave={save}
        onDiscard={discard}
        saveBlocked={invalidSections.length > 0}
        sectionsPanel={sectionsPanel}
      />

      {invalidSections.length > 0 && (
        <Alert variant="destructive" className="mx-4 mt-4 w-auto md:mx-6">
          <CircleAlertIcon />
          <AlertTitle>Salvamento bloqueado para proteger o conteúdo</AlertTitle>
          <AlertDescription>
            O conteúdo salvo de {invalidSections.join(", ")} está num formato que o site não reconhece e aparece com
            os valores padrão. Isso costuma indicar uma migração de dados pendente (<code>pnpm db:deploy</code>).
            Salvar agora apagaria o conteúdo real.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-1 p-4 md:p-6">
        <EditorProvider
          sections={state.sections}
          errors={state.errors}
          onUpdateField={updateField}
          onUpload={registerUpload}
        >
          {/* O formulário de contato da cópia não pode ser enviado. */}
          <div
            className="min-w-0 flex-1 overflow-hidden rounded-2xl border bg-background shadow-sm"
            onSubmitCapture={(event) => event.preventDefault()}
          >
            <div inert>
              <SiteHeader />
            </div>
            {state.sections.map((section, index) => (
              <SectionFrame
                key={section.key}
                sectionKey={section.key}
                visible={section.visible}
                isFirst={index === 0}
                isLast={index >= movableCount - 1}
                onMove={(offset) => move(section.key, offset)}
                onToggleVisible={() => toggleVisible(section.key)}
              >
                <SectionRenderer section={section} />
              </SectionFrame>
            ))}
          </div>
        </EditorProvider>

      </div>
    </div>
  );
}
