import { z } from "zod";
import { emptyImage, imageSchema, optionalText, requiredText } from "./shared";

export const experienceSchema = z.object({
  eyebrow: optionalText(40),
  title: requiredText(90),
  image: imageSchema,
  items: z
    .array(z.object({ label: requiredText(50) }))
    .max(8, "Use no máximo 8 itens."),
});

export type ExperienceContent = z.infer<typeof experienceSchema>;

export const experienceDefaults: ExperienceContent = {
  eyebrow: "Do conceito ao encontro",
  title: "A experiência chega onde seu público está.",
  image: emptyImage,
  items: [
    { label: "Eventos e ativações" },
    { label: "Treinamentos e onboarding" },
    { label: "Campanhas e pontos de venda" },
    { label: "Web, mobile e headsets" },
  ],
};
