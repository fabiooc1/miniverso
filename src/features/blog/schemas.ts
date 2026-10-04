import { z } from "zod";
import { SLUG_PATTERN } from "@/lib/slug";
import { isValidFileKey } from "@/lib/storage/keys";
import { extractPlainText, richTextDocumentSchema } from "./lib/rich-text";

const slugSchema = z
  .string()
  .trim()
  .min(1, "Informe a URL do post.")
  .max(80, "Use no máximo 80 caracteres.")
  .regex(SLUG_PATTERN, "Use apenas letras minúsculas, números e hífens.");

export const postInputSchema = z.object({
  title: z.string().trim().min(1, "Informe o título.").max(160, "Use no máximo 160 caracteres."),
  slug: slugSchema,
  excerpt: z.string().trim().min(1, "Escreva um resumo.").max(300, "Use no máximo 300 caracteres."),
  coverImageKey: z.string().refine(isValidFileKey, "Envie uma imagem de capa."),
  coverImageAlt: z
    .string()
    .trim()
    .min(1, "Descreva a imagem de capa.")
    .max(200, "Use no máximo 200 caracteres."),
  categoryIds: z.array(z.number().int().positive()).min(1, "Selecione pelo menos uma categoria."),
  content: richTextDocumentSchema.refine((document) => extractPlainText(document).trim().length > 0, {
    message: "Escreva o conteúdo do post.",
  }),
});

export type PostInput = z.infer<typeof postInputSchema>;

export const categoryInputSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome.").max(40, "Use no máximo 40 caracteres."),
});

export const POST_SORTS = {
  recentes: "Data de criação (mais recentes)",
  antigos: "Data de criação (mais antigos)",
  titulo: "Título (A–Z)",
} as const;

export type PostSort = keyof typeof POST_SORTS;

export function isPostSort(value: unknown): value is PostSort {
  return typeof value === "string" && value in POST_SORTS;
}
