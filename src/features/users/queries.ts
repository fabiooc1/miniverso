import "server-only";

import { headers } from "next/headers";
import { isAdminRole } from "@/features/auth/roles";
import { auth } from "@/lib/auth";

/** Lista as contas do painel. Chame após `requireSuperadmin`. */
export async function listUsers() {
  const { users } = await auth.api.listUsers({
    headers: await headers(),
    query: { limit: 200, sortBy: "createdAt", sortDirection: "asc" },
  });

  return users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: isAdminRole(user.role) ? user.role : "admin",
    banned: Boolean(user.banned),
    createdAt: new Date(user.createdAt),
  }));
}

export type UserListItem = Awaited<ReturnType<typeof listUsers>>[number];
