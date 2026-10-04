import { z } from "zod";
import { optionalText, requiredText } from "./shared";

export const processSchema = z.object({
  eyebrow: optionalText(40),
  title: requiredText(90),
  steps: z
    .array(z.object({ title: requiredText(24) }))
    .min(1, "Mantenha pelo menos uma etapa.")
    .max(6, "Use no máximo 6 etapas."),
});

export type ProcessContent = z.infer<typeof processSchema>;

export const processDefaults: ProcessContent = {
  eyebrow: "Como fazemos",
  title: "Da ideia ao “uau” em quatro movimentos.",
  steps: [{ title: "Imersão" }, { title: "Roteiro" }, { title: "Produção" }, { title: "Entrega" }],
};
