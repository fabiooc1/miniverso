"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ROLE_LABELS, type AdminRole } from "@/features/auth/roles";
import { updateProfile } from "../actions";

type ProfileFormProps = { name: string; email: string; role: AdminRole };

export function ProfileForm({ name: initialName, email, role }: ProfileFormProps) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      const result = await updateProfile({ name });
      if (!result.ok) {
        setError(result.fieldErrors?.name ?? result.message);
        return;
      }
      setError(undefined);
      toast.success(result.message);
    });
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>Seu nome aparece como autor dos posts.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field data-invalid={Boolean(error)}>
              <FieldLabel htmlFor="profile-name">Nome</FieldLabel>
              <Input id="profile-name" value={name} maxLength={80} aria-invalid={Boolean(error)} onChange={(event) => setName(event.target.value)} />
              <FieldError>{error}</FieldError>
            </Field>
            <Field data-disabled>
              <FieldLabel htmlFor="profile-email">E-mail</FieldLabel>
              <Input id="profile-email" value={email} disabled />
              <FieldDescription>
                Perfil de acesso: {ROLE_LABELS[role]}. Só um superadmin pode alterar e-mail e perfil.
              </FieldDescription>
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" disabled={isPending || name.trim() === initialName}>
            {isPending && <Spinner data-icon="inline-start" />}
            Salvar perfil
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
