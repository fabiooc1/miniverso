"use client";

import { ArrowDownIcon, ArrowUpIcon, EyeIcon, EyeOffIcon, LockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { sectionDefinitions, type SectionEntry, type SectionKey } from "../definitions";
import { sectionElementId } from "./section-frame";

type SectionsPanelProps = {
  sections: SectionEntry[];
  /** Quantidade de seções que podem ser reordenadas (as fixas ficam no fim). */
  movableCount: number;
  onMove: (sectionKey: SectionKey, offset: -1 | 1) => void;
  onToggleVisible: (sectionKey: SectionKey) => void;
  onNavigate?: () => void;
};

/** Lista das seções para reordenar, ocultar e navegar rapidamente. */
export function SectionsPanel({ sections, movableCount, onMove, onToggleVisible, onNavigate }: SectionsPanelProps) {
  function scrollTo(sectionKey: SectionKey) {
    document.getElementById(sectionElementId(sectionKey))?.scrollIntoView({ behavior: "smooth" });
    onNavigate?.();
  }

  return (
    <ol className="flex flex-col gap-1">
      {sections.map((section, index) => {
        const definition = sectionDefinitions[section.key];
        const fixed = "fixed" in definition;

        return (
          <li
            key={section.key}
            className={cn(
              "flex items-center gap-1 rounded-lg border bg-card py-1 pr-1 pl-3 text-sm",
              !section.visible && "text-muted-foreground",
            )}
          >
            <button
              type="button"
              className="flex-1 truncate py-1 text-left hover:text-primary"
              onClick={() => scrollTo(section.key)}
            >
              {definition.label}
            </button>
            {fixed ? (
              <LockIcon aria-label="Posição fixa" className="mr-2 size-3.5 text-muted-foreground" />
            ) : (
              <>
                <Button size="icon-xs" variant="ghost" aria-label={`Mover ${definition.label} para cima`} disabled={index === 0} onClick={() => onMove(section.key, -1)}>
                  <ArrowUpIcon />
                </Button>
                <Button size="icon-xs" variant="ghost" aria-label={`Mover ${definition.label} para baixo`} disabled={index >= movableCount - 1} onClick={() => onMove(section.key, 1)}>
                  <ArrowDownIcon />
                </Button>
                <Button
                  size="icon-xs"
                  variant="ghost"
                  aria-label={section.visible ? `Ocultar ${definition.label}` : `Exibir ${definition.label}`}
                  onClick={() => onToggleVisible(section.key)}
                >
                  {section.visible ? <EyeIcon /> : <EyeOffIcon />}
                </Button>
              </>
            )}
          </li>
        );
      })}
    </ol>
  );
}
