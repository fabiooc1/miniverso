import { ArrowRightIcon } from "lucide-react";
import { EditableImage } from "../editable/editable-image";
import { EditableListAdd, EditableListItem } from "../editable/editable-list";
import { EditableText } from "../editable/editable-text";
import type { ExperienceContent } from "../schemas/experience";
import { SectionHeading } from "./section-heading";

export function ExperienceSection({ content }: { content: ExperienceContent }) {
  return (
    <section className="dark">
      <div className="site-container grid items-center gap-12 py-20 md:py-24 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
          <EditableImage path="image" value={content.image} sizes="(min-width: 1024px) 50vw, 100vw" />
        </div>

        <div className="flex flex-col gap-8">
          <SectionHeading eyebrow={content.eyebrow} title={content.title} />
          <ul className="flex flex-col">
            {content.items.map((item, index) => (
              <EditableListItem
                key={index}
                path="items"
                index={index}
                as="li"
                className="flex items-center justify-between gap-4 border-b py-5 text-sm"
              >
                <EditableText path={`items.${index}.label`} value={item.label} placeholder="Item" />
                <ArrowRightIcon aria-hidden className="size-4 text-muted-foreground" />
              </EditableListItem>
            ))}
          </ul>
          <EditableListAdd
            path="items"
            template={{ label: "Novo item" }}
            label="Adicionar item"
            className="self-start"
          />
        </div>
      </div>
    </section>
  );
}
