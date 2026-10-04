"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/features/auth/session";
import { deleteUnreferencedFiles } from "@/features/uploads/references";
import type { Prisma } from "@/generated/prisma/client";
import { actionError, zodFieldErrors, type ActionResult } from "@/lib/action-result";
import { prisma } from "@/lib/prisma";
import { SECTION_KEYS, isSectionKey, sectionDefinitions, type SectionEntry } from "./definitions";
import { collectImageKeys } from "./lib/image-keys";
import { LANDING_CACHE_TAG } from "./queries";

const saveInputSchema = z.array(
  z.object({
    key: z.string(),
    visible: z.boolean(),
    content: z.unknown(),
  }),
);

/**
 * Salva conteúdo, ordem e visibilidade de todas as seções da landing.
 * A ordem do array é a ordem da página.
 */
export async function saveLandingSections(input: unknown): Promise<ActionResult<SectionEntry[]>> {
  const session = await requireAdmin();

  const parsedInput = saveInputSchema.safeParse(input);
  const keys = parsedInput.data?.map((section) => section.key) ?? [];
  const hasAllSections =
    keys.length === SECTION_KEYS.length && SECTION_KEYS.every((key) => keys.includes(key));

  if (!parsedInput.success || !hasAllSections) {
    return actionError("Dados inválidos. Recarregue a página e tente novamente.");
  }

  const fieldErrors: Record<string, string> = {};
  const sections: SectionEntry[] = [];

  for (const { key, visible, content } of parsedInput.data) {
    if (!isSectionKey(key)) continue;
    const definition = sectionDefinitions[key];
    const result = definition.schema.safeParse(content);

    if (!result.success) {
      for (const [path, message] of Object.entries(zodFieldErrors(result.error.issues))) {
        fieldErrors[`${key}.${path}`] = message;
      }
      continue;
    }
    // Seções fixas (rodapé) ficam sempre visíveis.
    sections.push({ key, visible: "fixed" in definition || visible, content: result.data } as SectionEntry);
  }

  if (Object.keys(fieldErrors).length > 0) {
    return actionError("Corrija os campos destacados antes de salvar.", fieldErrors);
  }

  // Seções fixas ficam sempre no fim da página.
  sections.sort(
    (a, b) =>
      Number("fixed" in sectionDefinitions[a.key]) - Number("fixed" in sectionDefinitions[b.key]),
  );

  const previous = await prisma.section.findMany({ select: { content: true } });
  const previousImages = collectImageKeys(previous.map((section) => section.content));

  await prisma.$transaction([
    // `position` é única: move todas para valores negativos antes de reordenar.
    prisma.$executeRaw`UPDATE "Section" SET "position" = -"position" - 1`,
    ...sections.map((section, position) => {
      const data = {
        position,
        visible: section.visible,
        content: section.content as Prisma.InputJsonValue,
        updatedBy: session.user.id,
      };
      return prisma.section.upsert({
        where: { key: section.key },
        create: { key: section.key, ...data },
        update: data,
      });
    }),
  ]);

  const currentImages = collectImageKeys(sections.map((section) => section.content));
  await deleteUnreferencedFiles([...previousImages].filter((key) => !currentImages.has(key)));

  updateTag(LANDING_CACHE_TAG);

  return { ok: true, message: "Landing page atualizada.", data: sections };
}
