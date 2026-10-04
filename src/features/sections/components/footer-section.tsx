import { Logo } from "@/components/brand/logo";
import { EditableLink } from "../editable/editable-link";
import { EditableListAdd, EditableListItem } from "../editable/editable-list";
import { EditableText } from "../editable/editable-text";
import type { FooterContent } from "../schemas/footer";

export function FooterSection({ content }: { content: FooterContent }) {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="site-container flex flex-col justify-between gap-10 py-14 md:flex-row">
        <div className="flex max-w-sm flex-col gap-4">
          <Logo variant="plain" />
          <EditableText
            path="description"
            value={content.description}
            as="p"
            multiline
            className="text-sm text-white/75"
            placeholder="Descrição"
          />
        </div>
        <div className="flex flex-col gap-2 md:items-end">
          <EditableText path="email" value={content.email} as="p" className="text-lg font-bold" placeholder="E-mail" />
          <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/75 [&>li+li]:before:mr-3 [&>li+li]:before:content-['·']">
            {content.links.map((link, index) => (
              <EditableListItem key={index} path="links" index={index} as="li">
                <EditableLink path={`links.${index}`} value={link} className="hover:text-white" />
              </EditableListItem>
            ))}
            <li className="empty:hidden">
              <EditableListAdd
                path="links"
                template={{ label: "Nova rede", href: "https://" }}
                label="Link"
                className="text-foreground"
              />
            </li>
          </ul>
          <EditableText
            path="copyright"
            value={content.copyright}
            as="p"
            className="text-xs text-white/60"
            placeholder="Copyright"
          />
        </div>
      </div>
    </footer>
  );
}
