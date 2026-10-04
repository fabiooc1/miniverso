"use client";

import { useActionState, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { signIn } from "../actions";

export function LoginForm({ notice }: { notice?: string }) {
  const [state, formAction, isPending] = useActionState(signIn, null);
  // Controlado para não ser apagado pelo reset automático do formulário após um erro.
  const [email, setEmail] = useState("");
  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;
  const message = state && !state.ok ? state.message : notice;

  return (
    <form action={formAction} noValidate>
      <FieldGroup>
        {message && (
          <Alert variant="destructive">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        <Field data-invalid={Boolean(fieldErrors?.email)}>
          <FieldLabel htmlFor="email">E-mail</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={Boolean(fieldErrors?.email)}
            className="h-11"
          />
          <FieldError>{fieldErrors?.email}</FieldError>
        </Field>
        <Field data-invalid={Boolean(fieldErrors?.password)}>
          <FieldLabel htmlFor="password">Senha</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            aria-invalid={Boolean(fieldErrors?.password)}
            className="h-11"
          />
          <FieldError>{fieldErrors?.password}</FieldError>
        </Field>
        <Button type="submit" variant="highlight" size="lg" disabled={isPending}>
          {isPending && <Spinner data-icon="inline-start" />}
          Entrar
        </Button>
      </FieldGroup>
    </form>
  );
}
