"use client";

import { PlusIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet, FieldLegend } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { createCategory } from "../actions";

export type CategoryOption = { id: number; name: string };

type CategoryPickerProps = {
  categories: CategoryOption[];
  selectedIds: number[];
  onSelectedChange: (ids: number[]) => void;
  onCategoryCreated: (category: CategoryOption) => void;
  error?: string;
};

/** Seleção de categorias do post, com criação rápida de uma nova. */
export function CategoryPicker({
  categories,
  selectedIds,
  onSelectedChange,
  onCategoryCreated,
  error,
}: CategoryPickerProps) {
  const [newName, setNewName] = useState("");
  const [isCreating, startCreating] = useTransition();

  function toggle(id: number, checked: boolean) {
    onSelectedChange(checked ? [...selectedIds, id] : selectedIds.filter((selected) => selected !== id));
  }

  function create() {
    if (!newName.trim()) return;
    startCreating(async () => {
      const result = await createCategory({ name: newName });
      if (!result.ok || !result.data) {
        toast.error(result.ok ? "Não foi possível criar a categoria." : (result.fieldErrors?.name ?? result.message));
        return;
      }
      onCategoryCreated(result.data);
      onSelectedChange([...selectedIds, result.data.id]);
      setNewName("");
    });
  }

  return (
    <FieldSet data-invalid={Boolean(error)}>
      <FieldLegend variant="label" className="sr-only">
        Categorias
      </FieldLegend>
      <FieldGroup className="gap-3">
        {categories.map((category) => {
          const id = `category-${category.id}`;
          return (
            <Field key={category.id} orientation="horizontal">
              <Checkbox
                id={id}
                checked={selectedIds.includes(category.id)}
                aria-invalid={Boolean(error)}
                onCheckedChange={(checked) => toggle(category.id, checked === true)}
              />
              <FieldLabel htmlFor={id} className="font-normal">
                {category.name}
              </FieldLabel>
            </Field>
          );
        })}
      </FieldGroup>
      <FieldError>{error}</FieldError>
      <InputGroup>
        <InputGroupInput
          value={newName}
          maxLength={40}
          placeholder="Nova categoria"
          aria-label="Nome da nova categoria"
          onChange={(event) => setNewName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              create();
            }
          }}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton aria-label="Adicionar categoria" disabled={isCreating || !newName.trim()} onClick={create}>
            {isCreating ? <Spinner /> : <PlusIcon />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </FieldSet>
  );
}
