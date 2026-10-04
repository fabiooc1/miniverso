import { z } from "zod";
import { requiredText } from "./shared";

export const brandsSchema = z.object({
  label: requiredText(60),
  items: z
    .array(z.object({ name: requiredText(30) }))
    .max(12, "Use no máximo 12 marcas."),
});

export type BrandsContent = z.infer<typeof brandsSchema>;

export const brandsDefaults: BrandsContent = {
  label: "Marcas que já entraram nesse universo",
  items: [
    { name: "Vale" },
    { name: "Equatorial" },
    { name: "Sebrae" },
    { name: "Alumar" },
    { name: "Fiema" },
  ],
};
