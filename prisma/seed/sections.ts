import type { Prisma } from "../../src/generated/prisma/client";
import { SECTION_KEYS, sectionDefinitions } from "../../src/features/sections/definitions";
import { prisma } from "../../src/lib/prisma";

/**
 * Cria as seções da landing com os valores padrão. Seções já existentes não
 * são alteradas, então o seed pode ser executado novamente com segurança.
 */
export async function seedSections() {
  const existing = await prisma.section.findMany({ select: { key: true, position: true } });
  const existingKeys = new Set(existing.map((section) => section.key));
  let nextPosition = Math.max(-1, ...existing.map((section) => section.position)) + 1;

  for (const key of SECTION_KEYS) {
    if (existingKeys.has(key)) continue;

    await prisma.section.create({
      data: {
        key,
        position: nextPosition++,
        content: sectionDefinitions[key].defaults as Prisma.InputJsonValue,
      },
    });
    console.log(`Seção criada: ${key}`);
  }
}
