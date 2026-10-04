import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Área de conteúdo padrão das páginas do painel. */
export function PageContainer({ children, className }: { children: ReactNode; className?: string }) {
  return <main className={cn("flex w-full max-w-6xl flex-col gap-8 p-6 md:p-10", className)}>{children}</main>;
}
