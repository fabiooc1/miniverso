"use client";

import { ArrowUpRightIcon, CircleAlertIcon, ListIcon } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { isSectionKey, sectionDefinitions } from "../definitions";
import { sectionElementId } from "./section-frame";

type EditorToolbarProps = {
  isDirty: boolean;
  isSaving: boolean;
  errors: Record<string, string>;
  onSave: () => void;
  onDiscard: () => void;
  /** Painel de seções, exibido numa Sheet. */
  sectionsPanel: React.ReactNode;
};

/** Barra fixa do editor: estado, erros, pré-visualização, descartar e salvar. */
export function EditorToolbar({ isDirty, isSaving, errors, onSave, onDiscard, sectionsPanel }: EditorToolbarProps) {
  const errorEntries = Object.entries(errors);

  return (
    <div className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b bg-background/90 px-6 py-4 backdrop-blur md:px-10">
      <div className="flex flex-col">
        <p className="eyebrow">Conteúdo do site</p>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-extrabold tracking-tight">Landing page</h1>
          {isDirty ? (
            <Badge variant="warning">● Alterações não salvas</Badge>
          ) : (
            <Badge variant="success">Tudo salvo</Badge>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {errorEntries.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="destructive">
                <CircleAlertIcon data-icon="inline-start" />
                {errorEntries.length} {errorEntries.length === 1 ? "erro" : "erros"}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80">
              <ul className="flex flex-col gap-2 text-sm">
                {errorEntries.map(([key, message]) => {
                  const sectionKey = key.split(".")[0];
                  const label = isSectionKey(sectionKey) ? sectionDefinitions[sectionKey].label : sectionKey;
                  return (
                    <li key={key}>
                      <button
                        type="button"
                        className="text-left hover:underline"
                        onClick={() =>
                          isSectionKey(sectionKey) &&
                          document.getElementById(sectionElementId(sectionKey))?.scrollIntoView({ behavior: "smooth" })
                        }
                      >
                        <span className="font-semibold">{label}:</span> {message}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </PopoverContent>
          </Popover>
        )}

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <ListIcon data-icon="inline-start" />
              Seções
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Seções</SheetTitle>
              <SheetDescription>Reordene ou oculte as seções da página.</SheetDescription>
            </SheetHeader>
            <div className="px-4">{sectionsPanel}</div>
          </SheetContent>
        </Sheet>

        <Button variant="outline" asChild>
          <Link href="/" target="_blank">
            Ver site
            <ArrowUpRightIcon data-icon="inline-end" />
          </Link>
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" disabled={!isDirty || isSaving}>
              Descartar
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Descartar alterações?</AlertDialogTitle>
              <AlertDialogDescription>
                O conteúdo volta para a última versão salva e as imagens enviadas nesta edição são removidas.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Continuar editando</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={onDiscard}>
                Descartar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button variant="highlight" disabled={!isDirty || isSaving} onClick={onSave}>
          {isSaving && <Spinner data-icon="inline-start" />}
          {isSaving ? "Salvando…" : "Salvar alterações"}
        </Button>
      </div>
    </div>
  );
}
