import { ArrowUpRightIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { EditableImage } from "../editable/editable-image";
import { EditableLink } from "../editable/editable-link";
import { EditableText } from "../editable/editable-text";
import type { HeroContent } from "../schemas/hero";

export function HeroSection({ content }: { content: HeroContent }) {
  return (
    <section className="dark">
      <div className="site-container grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2">
        <div className="flex flex-col items-start gap-6">
          <EditableText path="eyebrow" value={content.eyebrow} as="p" className="eyebrow" placeholder="Rótulo" />
          <EditableText
            path="title"
            value={content.title}
            as="h1"
            className="max-w-xl text-5xl leading-[1.02] font-extrabold tracking-tight text-balance md:text-6xl"
            placeholder="Título principal"
          />
          <EditableText
            path="description"
            value={content.description}
            as="p"
            multiline
            className="max-w-lg text-lg text-muted-foreground"
            placeholder="Descrição"
          />
          <EditableLink
            path="cta"
            value={content.cta}
            className={buttonVariants({ variant: "highlight", size: "lg" })}
          >
            <ArrowUpRightIcon data-icon="inline-end" />
          </EditableLink>
        </div>

        <figure className="relative aspect-square overflow-hidden rounded-3xl border">
          <EditableImage
            path="image"
            value={content.image}
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
          />
          <EditableText
            path="imageCaption"
            value={content.imageCaption}
            as="figcaption"
            className="absolute bottom-5 left-5 text-xs text-white/80"
            placeholder="Legenda"
          />
        </figure>
      </div>
    </section>
  );
}
