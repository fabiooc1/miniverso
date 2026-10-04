import "server-only";

import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "@/lib/auth";
import { isAdminRole, type AdminRole } from "./roles";

/**
 * Camada de acesso à sessão (DAL). Toda página e Server Action do painel deve
 * passar por `requireAdmin` ou `requireSuperadmin`: o proxy faz apenas uma
 * checagem otimista do cookie e esconder controles na interface não protege
 * nada.
 */
export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

export type AdminSession = NonNullable<Awaited<ReturnType<typeof getSession>>> & {
  user: { role: AdminRole };
};

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (!isAdminRole(session.user.role)) {
    redirect("/login?erro=sem-permissao");
  }

  return session as AdminSession;
}

export async function requireSuperadmin(): Promise<AdminSession> {
  const session = await requireAdmin();

  if (session.user.role !== "superadmin") {
    notFound();
  }

  return session;
}
