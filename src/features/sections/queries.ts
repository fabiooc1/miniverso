import "server-only";

import { cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  SECTION_KEYS,
  isSectionKey,
  sectionDefinitions,
  type SectionEntry,
  type SectionKey,
} from "./definitions";

export const LANDING_CACHE_TAG = "landing";

/**
 * Conteúdo inválido (ou de um formato antigo) cai para os valores padrão da
 * seção, sem quebrar a página; o erro fica registrado no log.
 */
function parseContent(key: SectionKey, raw: unknown) {
  const { schema, defaults } = sectionDefinitions[key];
  const result = schema.safeParse(raw);

  if (!result.success) {
    console.error(`[landing] Conteúdo inválido na seção "${key}"; usando os valores padrão.`, result.error.issues);
    return defaults;
  }
  return result.data;
}

/**
 * Todas as seções, na ordem salva. Seções que existem no código mas ainda não
 * no banco entram no fim com os valores padrão. Seções fixas ficam por último.
 */
async function loadSections(): Promise<SectionEntry[]> {
  const rows = await prisma.section.findMany({ orderBy: { position: "asc" } });
  const rowsByKey = new Map(rows.map((row) => [row.key, row]));

  const keys = rows.map((row) => row.key).filter(isSectionKey);
  for (const key of SECTION_KEYS) {
    if (!rowsByKey.has(key)) keys.push(key);
  }

  const entries = keys.map((key) => {
    const row = rowsByKey.get(key);
    return {
      key,
      visible: row?.visible ?? true,
      content: row ? parseContent(key, row.content) : sectionDefinitions[key].defaults,
    } as SectionEntry;
  });

  const isFixed = (entry: SectionEntry) => "fixed" in sectionDefinitions[entry.key];
  return [...entries.filter((entry) => !isFixed(entry)), ...entries.filter(isFixed)];
}

/** Seções visíveis da landing pública (cacheadas até a próxima gravação). */
export async function getLandingSections() {
  "use cache";
  cacheTag(LANDING_CACHE_TAG);

  const sections = await loadSections();
  return sections.filter((section) => section.visible);
}

/** Seções para o editor, incluindo as ocultas. Chame após `requireAdmin`. */
export async function getEditorSections() {
  return loadSections();
}
