"use client";

import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { pluralize } from "@/lib/format";
import { createCategory, deleteCategory, renameCategory } from "../actions";
import type { CategoryListItem } from "../queries";

export function CategoriesManager({ categories }: { categories: CategoryListItem[] }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <CategoryDialog
          title="Nova categoria"
          submitLabel="Criar categoria"
          onSubmit={(name) => createCategory({ name })}
          trigger={
            <Button variant="highlight">
              <PlusIcon data-icon="inline-start" />
              Nova categoria
            </Button>
          }
        />
      </div>

      {categories.length === 0 ? (
        <Empty className="border bg-card">
          <EmptyHeader>
            <EmptyTitle>Nenhuma categoria</EmptyTitle>
            <EmptyDescription>Crie categorias para organizar os posts do blog.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6 text-xs uppercase">Nome</TableHead>
                <TableHead className="text-xs uppercase">Posts</TableHead>
                <TableHead className="pr-6 text-right text-xs uppercase">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="pl-6 font-semibold">{category.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {pluralize(category._count.posts, "post", "posts")}
                  </TableCell>
                  <TableCell className="pr-6">
                    <div className="flex justify-end gap-2">
                      <CategoryDialog
                        title="Renomear categoria"
                        submitLabel="Salvar"
                        initialName={category.name}
                        onSubmit={(name) => renameCategory(category.id, { name })}
                        trigger={
                          <Button size="sm" variant="outline">
                            <PencilIcon data-icon="inline-start" />
                            Renomear
                          </Button>
                        }
                      />
                      <DeleteCategoryButton id={category.id} name={category.name} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

type CategoryDialogProps = {
  title: string;
  submitLabel: string;
  initialName?: string;
  trigger: React.ReactNode;
  onSubmit: (name: string) => Promise<
    { ok: true; message?: string } | { ok: false; message: string; fieldErrors?: Record<string, string> }
  >;
};

function CategoryDialog({ title, submitLabel, initialName = "", trigger, onSubmit }: CategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setName(initialName);
      setError(undefined);
    }
    setOpen(nextOpen);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      const result = await onSubmit(name);
      if (!result.ok) {
        setError(result.fieldErrors?.name ?? result.message);
        return;
      }
      toast.success(result.message);
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>O nome aparece nos filtros e nos posts do blog.</DialogDescription>
          </DialogHeader>
          <Field data-invalid={Boolean(error)}>
            <FieldLabel htmlFor="category-name">Nome</FieldLabel>
            <Input
              id="category-name"
              value={name}
              maxLength={40}
              autoFocus
              aria-invalid={Boolean(error)}
              onChange={(event) => setName(event.target.value)}
            />
            <FieldError>{error}</FieldError>
          </Field>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending || !name.trim()}>
              {isPending && <Spinner data-icon="inline-start" />}
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteCategoryButton({ id, name }: { id: number; name: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteCategory(id);
      if (result.ok) toast.success(result.message);
      else toast.error(result.message);
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive" disabled={isPending}>
          <Trash2Icon data-icon="inline-start" />
          Excluir
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir “{name}”?</AlertDialogTitle>
          <AlertDialogDescription>
            A categoria é removida dos posts. Não é possível excluir se algum post ficar sem categoria.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDelete}>
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
