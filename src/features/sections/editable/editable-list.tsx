"use client";

import { ArrowDownIcon, ArrowUpIcon, PlusIcon, Trash2Icon } from "lucide-react";
import type { ElementType, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEditableField, type EditableField } from "../editor/editor-context";
import { getIn } from "../lib/path";
import { getArrayBounds } from "../lib/schema-introspection";

function useEditableList(path: string) {
  const field = useEditableField(path);
  if (!field) return null;
  return createListApi(field);
}

function createListApi(field: EditableField) {
  const items = (getIn(field.content, field.path) as unknown[] | undefined) ?? [];
  const bounds = getArrayBounds(field.schema, field.path);

  return {
    count: items.length,
    canAdd: items.length < bounds.max,
    canRemove: items.length > bounds.min,
    add: (template: unknown) => field.update([...items, structuredClone(template)]),
    remove: (index: number) => field.update(items.filter((_, i) => i !== index)),
    move: (index: number, offset: -1 | 1) => {
      const target = index + offset;
      if (target < 0 || target >= items.length) return;
      const next = [...items];
      [next[index], next[target]] = [next[target], next[index]];
      field.update(next);
    },
  };
}

type EditableListItemProps = {
  /** Caminho da lista (ex.: "items"). */
  path: string;
  index: number;
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

/** Item de uma lista editável: no editor ganha controles de mover e remover. */
export function EditableListItem({ path, index, as: Tag = "div", className, children }: EditableListItemProps) {
  const list = useEditableList(path);

  if (!list) return <Tag className={className}>{children}</Tag>;

  return (
    <Tag className={cn(className, "group/item relative")}>
      {children}
      {/* Acima do item, para não cobrir o conteúdo nem o botão de link. O `pb-1`
          (em vez de margem) mantém o hover ao levar o mouse até a barra. */}
      <div className="pointer-events-none absolute right-0 bottom-full z-30 pb-1 opacity-0 transition group-hover/item:pointer-events-auto group-hover/item:opacity-100 focus-within:pointer-events-auto focus-within:opacity-100">
        <div className="flex gap-1 rounded-full border bg-popover p-0.5 text-popover-foreground shadow-sm">
          <Button
            size="icon-xs"
            variant="ghost"
            aria-label="Mover para antes"
            disabled={index === 0}
            onClick={() => list.move(index, -1)}
          >
            <ArrowUpIcon />
          </Button>
          <Button
            size="icon-xs"
            variant="ghost"
            aria-label="Mover para depois"
            disabled={index === list.count - 1}
            onClick={() => list.move(index, 1)}
          >
            <ArrowDownIcon />
          </Button>
          <Button
            size="icon-xs"
            variant="ghost"
            aria-label="Remover item"
            disabled={!list.canRemove}
            onClick={() => list.remove(index)}
          >
            <Trash2Icon />
          </Button>
        </div>
      </div>
    </Tag>
  );
}

type EditableListAddProps = {
  path: string;
  /** Conteúdo inicial do novo item; deve seguir o schema do item. */
  template: unknown;
  label: string;
  className?: string;
};

/** Botão "Adicionar" de uma lista editável. Fora do editor não renderiza nada. */
export function EditableListAdd({ path, template, label, className }: EditableListAddProps) {
  const list = useEditableList(path);
  if (!list || !list.canAdd) return null;

  return (
    <Button
      variant="outline"
      className={cn("border-dashed", className)}
      onClick={() => list.add(template)}
    >
      <PlusIcon data-icon="inline-start" />
      {label}
    </Button>
  );
}
