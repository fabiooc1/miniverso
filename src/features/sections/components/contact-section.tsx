import { ArrowUpRightIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EditableButton } from "../editable/editable-button";
import { EditableLink } from "../editable/editable-link";
import { EditableText } from "../editable/editable-text";
import type { ContactContent } from "../schemas/contact";

export function ContactSection({ content }: { content: ContactContent }) {
  return (
    <section id="contato" className="dark bg-brand-night-2">
      <div className="site-container grid gap-12 py-20 md:py-24 lg:grid-cols-2">
        <div className="flex flex-col items-start gap-6">
          <EditableText path="eyebrow" value={content.eyebrow} as="p" className="eyebrow" placeholder="Rótulo" />
          <EditableText
            path="title"
            value={content.title}
            as="h2"
            className="max-w-xl text-4xl leading-[1.05] font-extrabold tracking-tight text-balance md:text-5xl"
            placeholder="Título"
          />
          <EditableLink
            path="whatsapp"
            value={content.whatsapp}
            className={buttonVariants({ variant: "highlight", size: "lg" })}
          >
            <ArrowUpRightIcon data-icon="inline-end" />
          </EditableLink>
        </div>

        {/* O envio do formulário será implementado junto da landing pública. */}
        <form className="flex flex-col items-start gap-3" aria-label="Formulário de contato">
          <Input name="name" placeholder="Nome e empresa" aria-label="Nome e empresa" className="h-11" />
          <Input
            name="email"
            type="email"
            placeholder="E-mail corporativo"
            aria-label="E-mail corporativo"
            className="h-11"
          />
          <Textarea
            name="message"
            placeholder="Conte um pouco sobre o projeto"
            aria-label="Mensagem"
            className="min-h-24"
          />
          <EditableButton type="submit" variant="inverted" size="lg">
            <EditableText path="submitLabel" value={content.submitLabel} placeholder="Texto do botão" />
            <ArrowUpRightIcon data-icon="inline-end" />
          </EditableButton>
        </form>
      </div>
    </section>
  );
}
