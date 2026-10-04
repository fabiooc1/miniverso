import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { seedSections } from "./seed/sections";
import { seedStorage } from "./seed/storage";
import { seedSuperadmin } from "./seed/superadmin";

/** `pnpm db:seed` — idempotente: pode ser executado várias vezes. */
async function main() {
  await seedSections();
  await seedSuperadmin();
  await seedStorage();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
