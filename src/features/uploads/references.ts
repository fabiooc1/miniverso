import "server-only";

import { collectImageKeys } from "@/features/sections/lib/image-keys";
import { prisma } from "@/lib/prisma";
import { getStorage } from "@/lib/storage";

/** Dentre `keys`, retorna as que ainda são usadas pela landing ou pelo blog. */
export async function findReferencedFileKeys(keys: string[]) {
  const [sections, posts] = await Promise.all([
    prisma.section.findMany({ select: { content: true } }),
    prisma.post.findMany({
      where: { coverImageKey: { in: keys } },
      select: { coverImageKey: true },
    }),
  ]);

  const referenced = new Set(posts.map((post) => post.coverImageKey));
  for (const section of sections) {
    for (const key of collectImageKeys(section.content)) referenced.add(key);
  }

  return new Set(keys.filter((key) => referenced.has(key)));
}

/** Apaga do storage os arquivos que deixaram de ser referenciados. */
export async function deleteUnreferencedFiles(keys: Iterable<string>) {
  const unique = [...new Set(keys)].filter(Boolean);
  if (unique.length === 0) return;

  const referenced = await findReferencedFileKeys(unique);
  await Promise.all(
    unique.filter((key) => !referenced.has(key)).map((key) => getStorage().delete(key)),
  );
}
