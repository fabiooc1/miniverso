import { EditableText } from "../editable/editable-text";
import type { TestimonialContent } from "../schemas/testimonial";

export function TestimonialSection({ content }: { content: TestimonialContent }) {
  return (
    <section className="site-container grid gap-8 py-20 md:grid-cols-[1fr_3fr] md:py-28">
      <EditableText path="eyebrow" value={content.eyebrow} as="p" className="eyebrow" placeholder="Rótulo" />
      <figure className="flex flex-col gap-6">
        <span aria-hidden className="text-5xl leading-none font-bold text-primary">
          “
        </span>
        <blockquote>
          <EditableText
            path="quote"
            value={content.quote}
            as="p"
            multiline
            className="max-w-3xl text-2xl leading-snug text-balance md:text-3xl"
            placeholder="Depoimento"
          />
        </blockquote>
        <figcaption className="flex flex-wrap gap-1 text-xs text-muted-foreground">
          <EditableText path="author" value={content.author} placeholder="Nome" />
          {content.role ? <span aria-hidden>·</span> : null}
          <EditableText path="role" value={content.role} placeholder="Cargo" />
        </figcaption>
      </figure>
    </section>
  );
}
