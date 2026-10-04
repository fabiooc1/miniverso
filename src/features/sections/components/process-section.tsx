import { cn } from "@/lib/utils";
import { EditableListAdd, EditableListItem } from "../editable/editable-list";
import { EditableText } from "../editable/editable-text";
import type { ProcessContent } from "../schemas/process";
import { SectionHeading } from "./section-heading";

export function ProcessSection({ content }: { content: ProcessContent }) {
  const lastIndex = content.steps.length - 1;

  return (
    <section className="bg-primary text-primary-foreground">
      <div className="site-container flex flex-col gap-10 py-20 md:py-24">
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.title}
          className="[&_.eyebrow]:text-highlight"
        />
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-flow-col lg:auto-cols-fr lg:grid-cols-none">
          {content.steps.map((step, index) => (
            <EditableListItem
              key={index}
              path="steps"
              index={index}
              as="li"
              className={cn(
                "flex min-h-32 flex-col justify-between gap-6 rounded-xl bg-white/10 p-5",
                // A última etapa é destacada, como no design.
                index === lastIndex && "bg-highlight text-highlight-foreground",
              )}
            >
              <span className="text-xs opacity-70">{String(index + 1).padStart(2, "0")}</span>
              <EditableText
                path={`steps.${index}.title`}
                value={step.title}
                as="h3"
                className="text-lg font-bold"
                placeholder="Etapa"
              />
            </EditableListItem>
          ))}
        </ol>
        <EditableListAdd
          path="steps"
          template={{ title: "Nova etapa" }}
          label="Adicionar etapa"
          className="self-start text-foreground"
        />
      </div>
    </section>
  );
}
