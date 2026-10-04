"use server";

import { refresh } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { authActionError } from "@/features/auth/errors";
import { nameSchema, passwordSchema } from "@/features/auth/schemas";
import { requireAdmin } from "@/features/auth/session";
import { actionError, zodFieldErrors, type ActionResult } from "@/lib/action-result";
import { auth } from "@/lib/auth";

/*
 * Operações sobre a própria conta: o Better Auth identifica o usuário pela
 * sessão, e `updateUser` não permite alterar o perfil de acesso.
 */

export async function updateProfile(input: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = z.object({ name: nameSchema }).safeParse(input);
  if (!parsed.success) {
    return actionError("Verifique os campos.", zodFieldErrors(parsed.error.issues));
  }

  try {
    await auth.api.updateUser({ body: { name: parsed.data.name }, headers: await headers() });
  } catch (error) {
    return authActionError(error, "Não foi possível atualizar o perfil.");
  }

  refresh();
  return { ok: true, message: "Perfil atualizado." };
}

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Informe a senha atual."),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não conferem.",
    path: ["confirmPassword"],
  });

export async function changePassword(input: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) {
    return actionError("Verifique os campos.", zodFieldErrors(parsed.error.issues));
  }

  try {
    await auth.api.changePassword({
      body: {
        currentPassword: parsed.data.currentPassword,
        newPassword: parsed.data.newPassword,
        revokeOtherSessions: true,
      },
      headers: await headers(),
    });
  } catch (error) {
    return authActionError(error, "Não foi possível alterar a senha.");
  }

  refresh();
  return { ok: true, message: "Senha alterada. As outras sessões foram encerradas." };
}

export async function revokeOwnSession(sessionId: string): Promise<ActionResult> {
  const session = await requireAdmin();
  if (sessionId === session.session.id) {
    return actionError("Para encerrar a sessão atual, use “Sair”.");
  }

  const requestHeaders = await headers();
  const sessions = await auth.api.listSessions({ headers: requestHeaders });
  const target = sessions.find((item) => item.id === sessionId);
  if (!target) return actionError("Esta sessão já foi encerrada.");

  await auth.api.revokeSession({ body: { token: target.token }, headers: requestHeaders });

  refresh();
  return { ok: true, message: "Sessão encerrada." };
}

export async function revokeOtherOwnSessions(): Promise<ActionResult> {
  await requireAdmin();
  await auth.api.revokeOtherSessions({ headers: await headers() });

  refresh();
  return { ok: true, message: "Outras sessões encerradas." };
}
