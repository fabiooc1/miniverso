import { z } from "zod";
import { linkSchema, optionalText, requiredText } from "./shared";

export const footerSchema = z.object({
  description: optionalText(160),
  email: requiredText(80).pipe(z.email("Informe um e-mail válido.")),
  links: z.array(linkSchema).max(6, "Use no máximo 6 links."),
  copyright: optionalText(60),
});

export type FooterContent = z.infer<typeof footerSchema>;

export const footerDefaults: FooterContent = {
  description: "Experiências imersivas feitas em São Luís (MA) para marcas de todo o Brasil.",
  email: "oi@miniverso.com.br",
  links: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "Behance", href: "https://behance.net" },
  ],
  copyright: "© 2026 Miniverso",
};
