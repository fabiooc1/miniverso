import { z } from "zod";
import { emptyMedia, hrefSchema, mediaSchema, optionalText, requiredText } from "./shared";

export const projectsSchema = z.object({
  eyebrow: optionalText(40),
  title: requiredText(90),
  items: z
    .array(
      z.object({
        title: requiredText(60),
        tag: optionalText(30),
        href: hrefSchema.or(z.literal("")),
        media: mediaSchema,
      }),
    )
    .max(8, "Use no máximo 8 projetos."),
});

export type ProjectsContent = z.infer<typeof projectsSchema>;

export const projectsDefaults: ProjectsContent = {
  eyebrow: "Projetos selecionados",
  title: "Mundos que já tiramos do papel.",
  items: [
    { title: "Treinamento VR: Segurança Industrial", tag: "Experiência imersiva", href: "", media: emptyMedia },
    { title: "Museu do Futuro em AR", tag: "Experiência imersiva", href: "", media: emptyMedia },
    { title: "Lançamento 3D: Energia em Movimento", tag: "Experiência imersiva", href: "", media: emptyMedia },
    { title: "Imersão Amazônia", tag: "Experiência imersiva", href: "", media: emptyMedia },
  ],
};
