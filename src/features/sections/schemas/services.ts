import { z } from "zod";
import { optionalText, requiredText } from "./shared";

export const servicesSchema = z.object({
  eyebrow: optionalText(40),
  title: requiredText(90),
  items: z
    .array(
      z.object({
        title: requiredText(40),
        description: optionalText(140),
      }),
    )
    .min(1, "Mantenha pelo menos um serviço.")
    .max(6, "Use no máximo 6 serviços."),
});

export type ServicesContent = z.infer<typeof servicesSchema>;

export const servicesDefaults: ServicesContent = {
  eyebrow: "O que criamos",
  title: "Tecnologia com propósito. Impacto que permanece.",
  items: [
    {
      title: "Realidade Virtual",
      description: "Treinamentos, tours e ativações que transportam pessoas para novos contextos.",
    },
    {
      title: "Realidade Aumentada",
      description: "Camadas digitais interativas para produtos, espaços e campanhas.",
    },
    {
      title: "Conteúdo 3D",
      description: "Filmes, produtos e mundos digitais com acabamento de alto impacto.",
    },
  ],
};
