"use client";

import { MonitorIcon } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/format";
import type { ActionResult } from "@/lib/action-result";
import { revokeOtherOwnSessions, revokeOwnSession } from "../actions";
import type { OwnSession } from "../queries";

/** Resumo legível do user agent ("Chrome · Windows"). */
function describeDevice(userAgent: string | null) {
  if (!userAgent) return "Dispositivo desconhecido";
  const browser = /Edg\//.test(userAgent) ? "Edge" : /Chrome\//.test(userAgent) ? "Chrome" : /Firefox\//.test(userAgent) ? "Firefox" : /Safari\//.test(userAgent) ? "Safari" : "Navegador";
  const os = /Windows/.test(userAgent) ? "Windows" : /Android/.test(userAgent) ? "Android" : /iPhone|iPad/.test(userAgent) ? "iOS" : /Mac OS/.test(userAgent) ? "macOS" : /Linux/.test(userAgent) ? "Linux" : "";
  return os ? `${browser} · ${os}` : browser;
}

export function SessionsCard({ sessions }: { sessions: OwnSession[] }) {
  const [isPending, startTransition] = useTransition();
  const hasOthers = sessions.some((session) => !session.isCurrent);

  function run(action: () => Promise<ActionResult>) {
    startTransition(async () => {
      const result = await action();
      if (result.ok) toast.success(result.message);
      else toast.error(result.message);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sessões ativas</CardTitle>
        <CardDescription>Dispositivos conectados à sua conta.</CardDescription>
        {hasOthers && (
          <CardAction>
            <Button size="sm" variant="outline" disabled={isPending} onClick={() => run(revokeOtherOwnSessions)}>
              Encerrar as outras
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col divide-y">
          {sessions.map((session) => (
            <li key={session.id} className="flex items-center gap-3 py-3">
              <MonitorIcon className="size-5 text-muted-foreground" aria-hidden />
              <div className="flex flex-1 flex-col">
                <span className="text-sm font-semibold">{describeDevice(session.userAgent)}</span>
                <span className="text-xs text-muted-foreground">
                  {[session.ipAddress, `desde ${formatDateTime(session.createdAt)}`].filter(Boolean).join(" · ")}
                </span>
              </div>
              {session.isCurrent ? (
                <Badge variant="success">Esta sessão</Badge>
              ) : (
                <Button size="sm" variant="destructive" disabled={isPending} onClick={() => run(() => revokeOwnSession(session.id))}>
                  Encerrar
                </Button>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
