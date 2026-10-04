import type { ComponentType } from "react";
import type { SectionEntry } from "../definitions";
import { sectionRegistry } from "../registry";

/** Renderiza uma seção pelo componente registrado para a sua chave. */
export function SectionRenderer({ section }: { section: SectionEntry }) {
  const { Component } = sectionRegistry[section.key] as {
    Component: ComponentType<{ content: SectionEntry["content"] }>;
  };
  return <Component content={section.content} />;
}
