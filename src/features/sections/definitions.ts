import type { z } from "zod";
import { brandsDefaults, brandsSchema } from "./schemas/brands";
import { contactDefaults, contactSchema } from "./schemas/contact";
import { experienceDefaults, experienceSchema } from "./schemas/experience";
import { footerDefaults, footerSchema } from "./schemas/footer";
import { heroDefaults, heroSchema } from "./schemas/hero";
import { processDefaults, processSchema } from "./schemas/process";
import { projectsDefaults, projectsSchema } from "./schemas/projects";
import { servicesDefaults, servicesSchema } from "./schemas/services";
import { testimonialDefaults, testimonialSchema } from "./schemas/testimonial";

export type SectionDefinition<S extends z.ZodType = z.ZodType> = {
  label: string;
  schema: S;
  defaults: z.infer<S>;
  /** Âncora usada pela navegação do site (`#servicos`). */
  anchor?: string;
  /** Seções fixas não podem ser reordenadas nem ocultadas (ex.: rodapé). */
  fixed?: boolean;
};

function defineSection<S extends z.ZodType>(definition: SectionDefinition<S>) {
  return definition;
}

/**
 * Fonte única das seções da landing (sem componentes, para poder ser usada
 * pelo seed e pelo servidor). A ordem aqui é a ordem padrão da página.
 */
export const sectionDefinitions = {
  hero: defineSection({ label: "Hero", schema: heroSchema, defaults: heroDefaults }),
  brands: defineSection({ label: "Marcas", schema: brandsSchema, defaults: brandsDefaults }),
  services: defineSection({
    label: "O que criamos",
    schema: servicesSchema,
    defaults: servicesDefaults,
    anchor: "servicos",
  }),
  experience: defineSection({
    label: "Onde atuamos",
    schema: experienceSchema,
    defaults: experienceDefaults,
  }),
  process: defineSection({ label: "Como fazemos", schema: processSchema, defaults: processDefaults }),
  projects: defineSection({
    label: "Projetos",
    schema: projectsSchema,
    defaults: projectsDefaults,
    anchor: "projetos",
  }),
  testimonial: defineSection({
    label: "Depoimento",
    schema: testimonialSchema,
    defaults: testimonialDefaults,
  }),
  contact: defineSection({
    label: "Contato",
    schema: contactSchema,
    defaults: contactDefaults,
    anchor: "contato",
  }),
  footer: defineSection({
    label: "Rodapé",
    schema: footerSchema,
    defaults: footerDefaults,
    fixed: true,
  }),
};

export type SectionKey = keyof typeof sectionDefinitions;

export type SectionContentMap = {
  [K in SectionKey]: z.infer<(typeof sectionDefinitions)[K]["schema"]>;
};

export const SECTION_KEYS = Object.keys(sectionDefinitions) as SectionKey[];

export function isSectionKey(key: string): key is SectionKey {
  return key in sectionDefinitions;
}

/** Seção como usada pela página e pelo editor. */
export type SectionEntry<K extends SectionKey = SectionKey> = {
  key: K;
  visible: boolean;
  content: SectionContentMap[K];
  /**
   * O conteúdo salvo não passou no schema e foi trocado pelos valores padrão
   * (ex.: migração de dados pendente). Salvar sobrescreveria o conteúdo real.
   */
  invalidContent?: boolean;
};
