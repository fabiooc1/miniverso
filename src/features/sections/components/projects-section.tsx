import { ArrowUpRightIcon } from "lucide-react";
import { EditableLinkArea } from "../editable/editable-link";
import { EditableListAdd, EditableListItem } from "../editable/editable-list";
import { EditableMedia } from "../editable/editable-media";
import { EditableText } from "../editable/editable-text";
import type { ProjectsContent } from "../schemas/projects";
import { emptyMedia } from "../schemas/shared";
import { SectionHeading } from "./section-heading";

const newProject = { title: "Novo projeto", tag: "Experiência imersiva", href: "", media: emptyMedia };

type Project = ProjectsContent["items"][number];

function ProjectMedia({ project, index }: { project: Project; index: number }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-card">
      <EditableMedia
        path={`items.${index}.media`}
        value={project.media}
        sizes="(min-width: 768px) 50vw, 100vw"
        className="transition duration-500 group-hover:scale-105"
      />
    </div>
  );
}

export function ProjectsSection({ content }: { content: ProjectsContent }) {
  return (
    <section id="projetos" className="dark">
      <div className="site-container flex flex-col gap-12 py-20 md:py-24">
        <SectionHeading eyebrow={content.eyebrow} title={content.title} />
        <ul className="grid gap-x-5 gap-y-10 md:grid-cols-2">
          {content.items.map((item, index) => {
            // Com vídeo, o player fica fora do link: um botão dentro de <a> é inválido.
            const hasVideo = item.media.type === "video";
            return (
              <EditableListItem key={index} path="items" index={index} as="li" className="flex flex-col gap-3">
                {hasVideo && <ProjectMedia project={item} index={index} />}
                <EditableLinkArea path={`items.${index}.href`} href={item.href} className="group flex flex-col gap-3">
                  {!hasVideo && <ProjectMedia project={item} index={index} />}
                  <EditableText path={`items.${index}.title`} value={item.title} as="h3" placeholder="Projeto" />
                  <span className="flex items-center gap-1 text-[0.65rem] font-semibold text-muted-foreground uppercase">
                    <EditableText path={`items.${index}.tag`} value={item.tag} placeholder="Categoria" />
                    <ArrowUpRightIcon aria-hidden className="size-3" />
                  </span>
                </EditableLinkArea>
              </EditableListItem>
            );
          })}
        </ul>
        <EditableListAdd path="items" template={newProject} label="Adicionar projeto" className="self-start" />
      </div>
    </section>
  );
}
