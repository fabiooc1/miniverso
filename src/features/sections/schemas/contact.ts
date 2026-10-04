import { z } from "zod";
import { linkSchema, optionalText, requiredText } from "./shared";

export const contactSchema = z.object({
  eyebrow: optionalText(40),
  title: requiredText(80),
  whatsapp: linkSchema,
  submitLabel: requiredText(30),
});

export type ContactContent = z.infer<typeof contactSchema>;

export const contactDefaults: ContactContent = {
  eyebrow: "Vamos criar?",
  title: "Seu próximo universo começa com uma conversa.",
  whatsapp: { label: "Chamar no WhatsApp", href: "https://wa.me/5598900000000" },
  submitLabel: "Enviar mensagem",
};
