import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { authRoles } from "./auth-permissions";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
  },
  plugins: [
    admin({
      defaultRole: "admin",
      adminRoles: ["superadmin"],
      roles: authRoles,
    }),
    // Deve ser o último plugin: grava os cookies de sessão em Server Actions.
    nextCookies(),
  ],
});
