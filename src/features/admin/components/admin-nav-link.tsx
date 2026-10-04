"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { adminNav, type AdminNavId } from "../navigation";

/**
 * Recebe só o id: ícones são funções e não podem vir de Server Components.
 * O destaque do item ativo depende da URL (dado de requisição), por isso fica
 * atrás de um Suspense com o link sem destaque como fallback.
 */
export function AdminNavLink({ id }: { id: AdminNavId }) {
  return (
    <Suspense fallback={<NavLink id={id} isActive={false} />}>
      <ActiveNavLink id={id} />
    </Suspense>
  );
}

function ActiveNavLink({ id }: { id: AdminNavId }) {
  const pathname = usePathname();
  const { href } = adminNav[id];
  return <NavLink id={id} isActive={pathname === href || pathname.startsWith(`${href}/`)} />;
}

function NavLink({ id, isActive }: { id: AdminNavId; isActive: boolean }) {
  const item = adminNav[id];
  const Icon = item.icon;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
        <Link href={item.href}>
          <Icon />
          <span>{item.label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
