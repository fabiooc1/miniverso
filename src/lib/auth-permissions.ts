import { defaultAc, userAc } from "better-auth/plugins/admin/access";

export const authRoles = {
  admin: userAc,
  superadmin: defaultAc.newRole({
    user: [
      "create",
      "list",
      "get",
      "update",
      "set-role",
      "set-password",
      "set-email",
      "ban",
      "delete",
    ],
    session: ["list", "revoke", "delete"],
  }),
};
