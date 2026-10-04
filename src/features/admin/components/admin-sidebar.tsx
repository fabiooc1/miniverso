import Link from "next/link";
import { Suspense } from "react";
import { Logo } from "@/components/brand/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuSkeleton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { getSession } from "@/features/auth/session";
import { isAdminRole } from "@/features/auth/roles";
import { editorialNavIds } from "../navigation";
import { AdminNavLink } from "./admin-nav-link";
import { UserMenu } from "./user-menu";

export function AdminSidebar() {
  return (
    <Sidebar className="dark">
      <SidebarHeader className="p-4">
        <Link href="/admin" aria-label="Painel Miniverso">
          <Logo />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-highlight">Painel editorial</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {editorialNavIds.map((id) => (
                <AdminNavLink key={id} id={id} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Sistema</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Suspense fallback={<SidebarMenuSkeleton />}>
                <SystemNav />
              </Suspense>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <Suspense fallback={<SidebarMenuSkeleton showIcon />}>
          <SidebarUser />
        </Suspense>
      </SidebarFooter>
    </Sidebar>
  );
}

async function SystemNav() {
  const session = await getSession();
  return (
    <>
      {session?.user.role === "superadmin" && <AdminNavLink id="users" />}
      <AdminNavLink id="account" />
    </>
  );
}

async function SidebarUser() {
  const session = await getSession();
  if (!session || !isAdminRole(session.user.role)) return null;

  return <UserMenu name={session.user.name} email={session.user.email} role={session.user.role} />;
}
