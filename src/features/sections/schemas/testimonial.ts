import { z } from "zod";
import { optionalText, requiredText } from "./shared";

export const testimonialSchema = z.object({
  eyebrow: optionalText(40),
  quote: requiredText(220),
  author: requiredText(60),
  role: optionalText(60),
});

export type TestimonialContent = z.infer<typeof testimonialSchema>;

export const testimonialDefaults: TestimonialContent = {
  eyebrow: "Quem viveu, conta",
  quote:
    "A Miniverso transformou um tema técnico em uma experiência que todo mundo quis viver — e compartilhar.",
  author: "Marina Costa",
  role: "Gerente de Marketing",
};
