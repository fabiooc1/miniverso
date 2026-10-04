"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { PASSWORD_MIN_LENGTH } from "@/features/auth/schemas";
import { changePassword } from "../actions";

const EMPTY = { currentPassword: "", newPassword: "", confirmPassword: "" };

const FIELDS = [
  { name: "currentPassword", label: "Senha atual", autoComplete: "current-password" },
  { name: "newPassword", label: "Nova senha", autoComplete: "new-password" },
  { name: "confirmPassword", label: "Confirme a nova senha", autoComplete: "new-password" },
] as const;

export function PasswordForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      const result = await changePassword(values);
      if (!result.ok) {
        setErrors(result.fieldErrors ?? { currentPassword: result.message });
        return;
      }
      setValues(EMPTY);
      setErrors({});
      toast.success(result.message);
    });
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        <CardHeader>
          <CardTitle>Senha</CardTitle>
          <CardDescription>Ao trocar a senha, suas outras sessões são encerradas.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            {FIELDS.map((field) => (
              <Field key={field.name} data-invalid={Boolean(errors[field.name])}>
                <FieldLabel htmlFor={field.name}>{field.label}</FieldLabel>
                <Input
                  id={field.name}
                  type="password"
                  autoComplete={field.autoComplete}
                  value={values[field.name]}
                  aria-invalid={Boolean(errors[field.name])}
                  onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                />
                {errors[field.name] ? (
                  <FieldError>{errors[field.name]}</FieldError>
                ) : (
                  field.name === "newPassword" && (
                    <FieldDescription>Pelo menos {PASSWORD_MIN_LENGTH} caracteres.</FieldDescription>
                  )
                )}
              </Field>
            ))}
          </FieldGroup>
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending && <Spinner data-icon="inline-start" />}
            Alterar senha
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
