import { z } from "zod";
import { emptyImage, imageSchema, linkSchema, optionalText, requiredText } from "./shared";

export const heroSchema = z.object({
  eyebrow: optionalText(60),
  title: requiredText(80),
  description: optionalText(220),
  cta: linkSchema,
  image: imageSchema,
  imageCaption: optionalText(60),
});

export type HeroContent = z.infer<typeof heroSchema>;

export const heroDefaults: HeroContent = {
  eyebrow: "Experiências imersivas • São Luís, MA",
  title: "Sua marca dentro de um novo universo.",
  description:
    "Criamos experiências em VR, AR e 3D que transformam comunicação, treinamento e eventos em momentos memoráveis.",
  cta: { label: "Começar um projeto", href: "#contato" },
  image: emptyImage,
  imageCaption: "VR · AR · 3D / sem limites",
};
