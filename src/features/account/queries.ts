import "server-only";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

/** Sessões do usuário atual, sem o token (que nunca vai para o navegador). */
export async function listOwnSessions(currentSessionId: string) {
  const sessions = await auth.api.listSessions({ headers: await headers() });

  return sessions
    .map((session) => ({
      id: session.id,
      userAgent: session.userAgent ?? null,
      ipAddress: session.ipAddress ?? null,
      createdAt: new Date(session.createdAt),
      isCurrent: session.id === currentSessionId,
    }))
    .toSorted((a, b) => Number(b.isCurrent) - Number(a.isCurrent) || b.createdAt.getTime() - a.createdAt.getTime());
}

export type OwnSession = Awaited<ReturnType<typeof listOwnSessions>>[number];
