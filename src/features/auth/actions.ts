"use server";

import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { actionError, zodFieldErrors, type ActionResult } from "@/lib/action-result";
import { auth } from "@/lib/auth";

const signInSchema = z.object({
  email: z.email("Informe um e-mail válido."),
  password: z.string().min(1, "Informe a senha."),
});

export async function signIn(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = signInSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return actionError("Verifique os campos.", zodFieldErrors(parsed.error.issues));
  }

  try {
    await auth.api.signInEmail({ body: parsed.data, headers: await headers() });
  } catch (error) {
    if (error instanceof APIError) {
      return actionError(
        error.status === "FORBIDDEN"
          ? "Esta conta está bloqueada. Fale com um superadmin."
          : "E-mail ou senha inválidos.",
      );
    }
    throw error;
  }

  redirect("/admin");
}

export async function signOut() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/login");
}
