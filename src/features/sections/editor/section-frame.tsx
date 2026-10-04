"use client";

import { ArrowDownIcon, ArrowUpIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { sectionDefinitions, type SectionKey } from "../definitions";
import { SectionScopeContext } from "./editor-context";

type SectionFrameProps = {
  sectionKey: SectionKey;
  visible: boolean;
  isFirst: boolean;
  isLast: boolean;
  onMove: (offset: -1 | 1) => void;
  onToggleVisible: () => void;
  children: ReactNode;
};

export function sectionElementId(sectionKey: SectionKey) {
  return `editor-section-${sectionKey}`;
}

/** Moldura de uma seção no editor: rótulo e controles de ordem e visibilidade. */
export function SectionFrame({
  sectionKey,
  visible,
  isFirst,
  isLast,
  onMove,
  onToggleVisible,
  children,
}: SectionFrameProps) {
  const definition = sectionDefinitions[sectionKey];
  const fixed = "fixed" in definition;

  return (
    <div
      id={sectionElementId(sectionKey)}
      className="group/section relative scroll-mt-28 outline-2 -outline-offset-2 outline-transparent hover:outline-primary"
    >
      <div
        className={cn(
          "absolute top-3 left-3 z-20 flex gap-2 opacity-0 transition group-hover/section:opacity-100",
          !visible && "opacity-100",
        )}
      >
        <Badge>{definition.label}</Badge>
        {!visible && <Badge variant="warning">Oculta no site</Badge>}
      </div>

      {!fixed && (
        <div className="absolute top-3 right-3 z-20 flex gap-1 rounded-full border bg-popover p-1 text-popover-foreground opacity-0 shadow-md transition group-hover/section:opacity-100 focus-within:opacity-100">
          <Button size="icon-sm" variant="ghost" aria-label="Mover seção para cima" disabled={isFirst} onClick={() => onMove(-1)}>
            <ArrowUpIcon />
          </Button>
          <Button size="icon-sm" variant="ghost" aria-label="Mover seção para baixo" disabled={isLast} onClick={() => onMove(1)}>
            <ArrowDownIcon />
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            aria-label={visible ? "Ocultar seção no site" : "Exibir seção no site"}
            onClick={onToggleVisible}
          >
            {visible ? <EyeIcon /> : <EyeOffIcon />}
          </Button>
        </div>
      )}

      <div className={cn(!visible && "opacity-40")}>
        <SectionScopeContext value={{ sectionKey, schema: definition.schema }}>{children}</SectionScopeContext>
      </div>
    </div>
  );
}
