import { ArrowUpRightIcon } from "lucide-react";
import { emptyImage } from "../schemas/shared";
import { EditableImage } from "../editable/editable-image";
import { EditableLinkArea } from "../editable/editable-link";
import { EditableListAdd, EditableListItem } from "../editable/editable-list";
import { EditableText } from "../editable/editable-text";
import type { ProjectsContent } from "../schemas/projects";
import { SectionHeading } from "./section-heading";

const newProject = { title: "Novo projeto", tag: "Experiência imersiva", href: "", image: emptyImage };

export function ProjectsSection({ content }: { content: ProjectsContent }) {
  return (
    <section id="projetos" className="dark">
      <div className="site-container flex flex-col gap-12 py-20 md:py-24">
        <SectionHeading eyebrow={content.eyebrow} title={content.title} />
        <ul className="grid gap-x-5 gap-y-10 md:grid-cols-2">
          {content.items.map((item, index) => (
            <EditableListItem key={index} path="items" index={index} as="li">
              <EditableLinkArea path={`items.${index}.href`} href={item.href} className="group flex flex-col gap-3">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-card">
                  <EditableImage
                    path={`items.${index}.image`}
                    value={item.image}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="transition duration-500 group-hover:scale-105"
                  />
                </div>
                <EditableText path={`items.${index}.title`} value={item.title} as="h3" placeholder="Projeto" />
                <span className="flex items-center gap-1 text-[0.65rem] font-semibold text-muted-foreground uppercase">
                  <EditableText path={`items.${index}.tag`} value={item.tag} placeholder="Categoria" />
                  <ArrowUpRightIcon aria-hidden className="size-3" />
                </span>
              </EditableLinkArea>
            </EditableListItem>
          ))}
        </ul>
        <EditableListAdd path="items" template={newProject} label="Adicionar projeto" className="self-start" />
      </div>
    </section>
  );
}
