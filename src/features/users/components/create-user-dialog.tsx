"use client";

import { PlusIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
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
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { PASSWORD_MIN_LENGTH } from "@/features/auth/schemas";
import { createUser } from "../actions";
import { RoleSelect } from "./role-select";

const EMPTY_FORM = { name: "", email: "", password: "", role: "admin" };

export function CreateUserDialog() {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setValues(EMPTY_FORM);
      setErrors({});
    }
    setOpen(nextOpen);
  }

  function set(field: keyof typeof EMPTY_FORM, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      const result = await createUser(values);
      if (!result.ok) {
        setErrors(result.fieldErrors ?? {});
        if (!result.fieldErrors) toast.error(result.message);
        return;
      }
      toast.success(result.message);
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="highlight">
          <PlusIcon data-icon="inline-start" />
          Novo colaborador
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle>Novo colaborador</DialogTitle>
            <DialogDescription>Compartilhe a senha inicial com a pessoa por um canal seguro.</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field data-invalid={Boolean(errors.name)}>
              <FieldLabel htmlFor="new-user-name">Nome</FieldLabel>
              <Input id="new-user-name" value={values.name} maxLength={80} aria-invalid={Boolean(errors.name)} onChange={(event) => set("name", event.target.value)} />
              <FieldError>{errors.name}</FieldError>
            </Field>
            <Field data-invalid={Boolean(errors.email)}>
              <FieldLabel htmlFor="new-user-email">E-mail</FieldLabel>
              <Input id="new-user-email" type="email" value={values.email} aria-invalid={Boolean(errors.email)} onChange={(event) => set("email", event.target.value)} />
              <FieldError>{errors.email}</FieldError>
            </Field>
            <Field data-invalid={Boolean(errors.password)}>
              <FieldLabel htmlFor="new-user-password">Senha inicial</FieldLabel>
              <Input id="new-user-password" type="password" autoComplete="new-password" value={values.password} aria-invalid={Boolean(errors.password)} onChange={(event) => set("password", event.target.value)} />
              {errors.password ? (
                <FieldError>{errors.password}</FieldError>
              ) : (
                <FieldDescription>Pelo menos {PASSWORD_MIN_LENGTH} caracteres.</FieldDescription>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="new-user-role">Perfil</FieldLabel>
              <RoleSelect id="new-user-role" value={values.role} onValueChange={(role) => set("role", role)} />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending && <Spinner data-icon="inline-start" />}
              Criar conta
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
