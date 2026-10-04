import type { ComponentType } from "react";
import { BrandsSection } from "./components/brands-section";
import { ContactSection } from "./components/contact-section";
import { ExperienceSection } from "./components/experience-section";
import { FooterSection } from "./components/footer-section";
import { HeroSection } from "./components/hero-section";
import { ProcessSection } from "./components/process-section";
import { ProjectsSection } from "./components/projects-section";
import { ServicesSection } from "./components/services-section";
import { TestimonialSection } from "./components/testimonial-section";
import { sectionDefinitions, type SectionContentMap, type SectionKey } from "./definitions";

/** Liga cada seção ao componente que a renderiza (público e editor). */
const sectionComponents: { [K in SectionKey]: ComponentType<{ content: SectionContentMap[K] }> } = {
  hero: HeroSection,
  brands: BrandsSection,
  services: ServicesSection,
  experience: ExperienceSection,
  process: ProcessSection,
  projects: ProjectsSection,
  testimonial: TestimonialSection,
  contact: ContactSection,
  footer: FooterSection,
};

export const sectionRegistry = Object.fromEntries(
  Object.entries(sectionDefinitions).map(([key, definition]) => [
    key,
    { ...definition, Component: sectionComponents[key as SectionKey] },
  ]),
) as {
  [K in SectionKey]: (typeof sectionDefinitions)[K] & {
    Component: ComponentType<{ content: SectionContentMap[K] }>;
  };
};
