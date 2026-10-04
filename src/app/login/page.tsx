import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Logo } from "@/components/brand/logo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/features/auth/components/login-form";
import { getSession } from "@/features/auth/session";
import { isAdminRole } from "@/features/auth/roles";

export const metadata: Metadata = { title: "Entrar" };

const NOTICES: Record<string, string> = {
  "sem-permissao": "Sua conta não tem acesso ao painel.",
};

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <main className="dark flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-md gap-8 p-2">
        <CardHeader className="flex flex-col gap-6">
          <Logo />
          <div className="flex flex-col gap-1">
            <p className="eyebrow">Painel editorial</p>
            <CardTitle className="text-3xl font-extrabold tracking-tight">Entrar</CardTitle>
            <CardDescription>Acesso restrito à equipe Miniverso.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LoginForm />}>
            <LoginGate searchParams={searchParams} />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}

/** Lê a sessão e os parâmetros da URL em tempo de requisição. */
async function LoginGate({ searchParams }: Pick<PageProps<"/login">, "searchParams">) {
  const [session, { erro }] = await Promise.all([getSession(), searchParams]);

  if (session && isAdminRole(session.user.role)) {
    redirect("/admin");
  }

  return <LoginForm notice={typeof erro === "string" ? NOTICES[erro] : undefined} />;
}
