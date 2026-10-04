import { EditableListAdd, EditableListItem } from "../editable/editable-list";
import { EditableText } from "../editable/editable-text";
import type { ServicesContent } from "../schemas/services";
import { SectionHeading } from "./section-heading";

export function ServicesSection({ content }: { content: ServicesContent }) {
  return (
    <section id="servicos" className="site-container flex flex-col gap-12 py-20 md:py-24">
      <SectionHeading eyebrow={content.eyebrow} title={content.title} />
      <ul className="grid gap-4 md:grid-cols-3">
        {content.items.map((item, index) => (
          <EditableListItem
            key={index}
            path="items"
            index={index}
            as="li"
            className="flex min-h-52 flex-col gap-3 rounded-xl border bg-card p-6 text-card-foreground"
          >
            <span className="text-xs font-bold text-primary">{String(index + 1).padStart(2, "0")}</span>
            <EditableText
              path={`items.${index}.title`}
              value={item.title}
              as="h3"
              className="mt-auto text-xl"
              placeholder="Serviço"
            />
            <EditableText
              path={`items.${index}.description`}
              value={item.description}
              as="p"
              multiline
              className="text-sm text-muted-foreground"
              placeholder="Descrição"
            />
          </EditableListItem>
        ))}
      </ul>
      <EditableListAdd
        path="items"
        template={{ title: "Novo serviço", description: "" }}
        label="Adicionar serviço"
        className="self-start"
      />
    </section>
  );
}
