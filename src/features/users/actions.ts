"use server";

import { refresh } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { authActionError } from "@/features/auth/errors";
import { nameSchema, passwordSchema, roleSchema } from "@/features/auth/schemas";
import { requireSuperadmin } from "@/features/auth/session";
import { actionError, zodFieldErrors, type ActionResult } from "@/lib/action-result";
import { auth } from "@/lib/auth";

/*
 * Gestão de outras contas: exclusiva do superadmin. As chamadas ao Better Auth
 * recebem os headers da requisição, então o plugin também confere a permissão
 * de quem está pedindo.
 */

const createUserSchema = z.object({
  name: nameSchema,
  email: z.email("Informe um e-mail válido.").trim().toLowerCase(),
  password: passwordSchema,
  role: roleSchema,
});

export async function createUser(input: unknown): Promise<ActionResult> {
  await requireSuperadmin();

  const parsed = createUserSchema.safeParse(input);
  if (!parsed.success) {
    return actionError("Verifique os campos.", zodFieldErrors(parsed.error.issues));
  }

  try {
    await auth.api.createUser({ body: parsed.data, headers: await headers() });
  } catch (error) {
    return authActionError(error, "Não foi possível criar a conta.");
  }

  refresh();
  return { ok: true, message: "Conta criada." };
}

/** Garante que o superadmin não altere o próprio perfil, bloqueio ou conta. */
async function requireOtherUser(userId: string) {
  const session = await requireSuperadmin();
  if (session.user.id === userId) {
    return actionError("Use “Minha conta” para alterar a sua própria conta.");
  }
  return null;
}

export async function setUserRole(userId: string, role: unknown): Promise<ActionResult> {
  const denied = await requireOtherUser(userId);
  if (denied) return denied;

  const parsed = roleSchema.safeParse(role);
  if (!parsed.success) return actionError("Perfil inválido.");

  try {
    await auth.api.setRole({ body: { userId, role: parsed.data }, headers: await headers() });
  } catch (error) {
    return authActionError(error, "Não foi possível alterar o perfil.");
  }

  refresh();
  return { ok: true, message: "Perfil atualizado." };
}

export async function setUserPassword(userId: string, password: unknown): Promise<ActionResult> {
  const denied = await requireOtherUser(userId);
  if (denied) return denied;

  const parsed = passwordSchema.safeParse(password);
  if (!parsed.success) {
    return actionError("Senha inválida.", { password: parsed.error.issues[0]?.message ?? "Senha inválida." });
  }

  try {
    await auth.api.setUserPassword({ body: { userId, newPassword: parsed.data }, headers: await headers() });
  } catch (error) {
    return authActionError(error, "Não foi possível redefinir a senha.");
  }

  return { ok: true, message: "Senha redefinida." };
}

export async function setUserBanned(userId: string, banned: boolean): Promise<ActionResult> {
  const denied = await requireOtherUser(userId);
  if (denied) return denied;

  try {
    const requestHeaders = await headers();
    if (banned) await auth.api.banUser({ body: { userId }, headers: requestHeaders });
    else await auth.api.unbanUser({ body: { userId }, headers: requestHeaders });
  } catch (error) {
    return authActionError(error, "Não foi possível alterar o acesso da conta.");
  }

  refresh();
  return { ok: true, message: banned ? "Conta bloqueada." : "Conta desbloqueada." };
}

export async function removeUser(userId: string): Promise<ActionResult> {
  const denied = await requireOtherUser(userId);
  if (denied) return denied;

  try {
    // Os posts do usuário continuam publicados, sem autor (onDelete: SetNull).
    await auth.api.removeUser({ body: { userId }, headers: await headers() });
  } catch (error) {
    return authActionError(error, "Não foi possível excluir a conta.");
  }

  refresh();
  return { ok: true, message: "Conta excluída." };
}
