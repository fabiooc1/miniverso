import type { NodeViewRenderer } from "@tiptap/core";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { z } from "zod";
import { videoSchema } from "@/features/video/video";
import { createVideoNode } from "./video-node";

/**
 * Extensões do editor de posts. O mesmo conjunto deve ser usado para editar e
 * para renderizar, garantindo que só exista o que o editor sabe produzir.
 */
export function createRichTextExtensions({
  placeholder,
  videoNodeView,
}: { placeholder?: string; videoNodeView?: NodeViewRenderer } = {}) {
  return [
    StarterKit.configure({
      heading: { levels: [2, 3] },
      code: false,
      codeBlock: false,
      link: {
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        protocols: ["http", "https", "mailto"],
        HTMLAttributes: { rel: "noopener noreferrer nofollow", target: "_blank" },
      },
    }),
    createVideoNode(videoNodeView),
    ...(placeholder ? [Placeholder.configure({ placeholder })] : []),
  ];
}

const NODE_TYPES = [
  "doc",
  "paragraph",
  "text",
  "heading",
  "bulletList",
  "orderedList",
  "listItem",
  "blockquote",
  "horizontalRule",
  "hardBreak",
  "video",
] as const;

const MARK_TYPES = ["bold", "italic", "underline", "strike", "link"] as const;

const SAFE_HREF = /^(https?:\/\/|mailto:)/i;

const markSchema = z
  .object({
    type: z.enum(MARK_TYPES),
    attrs: z.record(z.string(), z.unknown()).optional(),
  })
  .refine((mark) => mark.type !== "link" || SAFE_HREF.test(String(mark.attrs?.href ?? "")), {
    message: "Links devem começar com http://, https:// ou mailto:.",
  });

export type RichTextNode = {
  type: (typeof NODE_TYPES)[number];
  attrs?: Record<string, unknown>;
  content?: RichTextNode[];
  text?: string;
  marks?: z.infer<typeof markSchema>[];
};

/** Atributos do bloco de vídeo, sem os `null` que o Tiptap usa como padrão. */
function isValidVideoAttrs(attrs: Record<string, unknown> | undefined) {
  const defined = Object.fromEntries(Object.entries(attrs ?? {}).filter(([, value]) => value != null));
  return videoSchema.safeParse(defined).success;
}

const nodeSchema: z.ZodType<RichTextNode> = z.lazy(() =>
  z
    .object({
      type: z.enum(NODE_TYPES),
      attrs: z.record(z.string(), z.unknown()).optional(),
      content: z.array(nodeSchema).optional(),
      text: z.string().optional(),
      marks: z.array(markSchema).optional(),
    })
    .refine((node) => node.type !== "video" || isValidVideoAttrs(node.attrs), {
      message: "Vídeo inválido no conteúdo.",
    }),
);

/** Documento do Tiptap restrito aos nós e marcas que o editor produz. */
export const richTextDocumentSchema = nodeSchema.refine((node) => node.type === "doc", {
  message: "Documento inválido.",
});

export const EMPTY_DOCUMENT: RichTextNode = { type: "doc", content: [{ type: "paragraph" }] };

export function extractPlainText(node: RichTextNode): string {
  if (node.text) return node.text;
  return (node.content ?? []).map(extractPlainText).join(" ");
}

const WORDS_PER_MINUTE = 200;

export function estimateReadingTime(document: RichTextNode) {
  const words = extractPlainText(document).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
