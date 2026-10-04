export const ADMIN_ROLES = ["admin", "superadmin"] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

export const ROLE_LABELS: Record<AdminRole, string> = {
  admin: "Admin",
  superadmin: "Superadmin",
};

export function isAdminRole(role: unknown): role is AdminRole {
  return ADMIN_ROLES.includes(role as AdminRole);
}
