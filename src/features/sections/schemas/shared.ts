import { z } from "zod";

/** Texto simples obrigatório, sem formatação. `max` deve caber no design. */
export function requiredText(max: number) {
  return z
    .string()
    .trim()
    .min(1, "Campo obrigatório.")
    .max(max, `Use no máximo ${max} caracteres.`);
}

export function optionalText(max: number) {
  return z.string().trim().max(max, `Use no máximo ${max} caracteres.`);
}

const HREF_PATTERN = /^(https?:\/\/|mailto:|tel:|\/|#)/;

export const hrefSchema = z
  .string()
  .trim()
  .min(1, "Informe o link.")
  .max(300, "Use no máximo 300 caracteres.")
  .regex(HREF_PATTERN, "Use um link http(s)://, mailto:, tel:, /caminho ou #ancora.");

export const linkSchema = z.object({
  label: requiredText(40),
  href: hrefSchema,
});

/**
 * Imagem guardada pela chave do serviço de arquivos, nunca pela URL.
 * `key` vazia significa "sem imagem" e a seção exibe um placeholder.
 */
export const imageSchema = z
  .object({
    key: z.string(),
    alt: optionalText(200),
  })
  .refine((image) => !image.key || image.alt.length > 0, {
    message: "Descreva a imagem (texto alternativo).",
    path: ["alt"],
  });

export const emptyImage = { key: "", alt: "" };

export type LinkContent = z.infer<typeof linkSchema>;
export type ImageContent = z.infer<typeof imageSchema>;
