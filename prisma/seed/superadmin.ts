import { auth } from "../../src/lib/auth";
import { prisma } from "../../src/lib/prisma";

/**
 * Cria o superadmin inicial a partir do `.env`:
 *   SUPERADMIN_NAME, SUPERADMIN_EMAIL e SUPERADMIN_PASSWORD.
 * Se as variáveis estiverem vazias, a etapa é ignorada. Se o e-mail já
 * existir, a conta não é alterada.
 */
export async function seedSuperadmin() {
  const name = process.env.SUPERADMIN_NAME?.trim();
  const email = process.env.SUPERADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SUPERADMIN_PASSWORD;

  if (!name || !email || !password) {
    console.log("Superadmin: preencha SUPERADMIN_NAME, SUPERADMIN_EMAIL e SUPERADMIN_PASSWORD no .env para criá-lo.");
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email }, select: { role: true } });
  if (existing) {
    console.log(`Superadmin: ${email} já existe (perfil ${existing.role}); nada foi alterado.`);
    return;
  }

  // Sem headers: chamada server-side confiável, sem sessão de quem solicita.
  await auth.api.createUser({ body: { name, email, password, role: "superadmin" } });
  console.log(`Superadmin criado: ${email}`);
}
