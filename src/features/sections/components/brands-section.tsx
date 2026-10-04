import { EditableListAdd, EditableListItem } from "../editable/editable-list";
import { EditableText } from "../editable/editable-text";
import type { BrandsContent } from "../schemas/brands";

export function BrandsSection({ content }: { content: BrandsContent }) {
  return (
    <section className="bg-highlight text-highlight-foreground">
      <div className="site-container flex flex-col gap-6 py-6 md:flex-row md:items-center md:justify-between">
        <EditableText
          path="label"
          value={content.label}
          as="p"
          className="text-xs font-bold uppercase"
          placeholder="Rótulo"
        />
        <ul className="flex flex-wrap items-center gap-x-12 gap-y-4">
          {content.items.map((item, index) => (
            <EditableListItem key={index} path="items" index={index} as="li">
              <EditableText
                path={`items.${index}.name`}
                value={item.name}
                className="text-sm font-extrabold uppercase"
                placeholder="Marca"
              />
            </EditableListItem>
          ))}
          <li className="empty:hidden">
            <EditableListAdd path="items" template={{ name: "Nova marca" }} label="Marca" />
          </li>
        </ul>
      </div>
    </section>
  );
}
