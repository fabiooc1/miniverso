import type { CSSProperties } from "react";
import { ArrowUpRightIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EditableMedia } from "../editable/editable-media";
import { EditableLink } from "../editable/editable-link";
import { EditableText } from "../editable/editable-text";
import type { HeroContent } from "../schemas/hero";

export function HeroSection({ content }: { content: HeroContent }) {
  return (
    <section className="dark">
      <div className="site-container grid grid-cols-1 items-center gap-12 py-16 md:py-24 lg:grid-cols-2">
        <div className="flex flex-col items-start gap-6">
          <div data-enter>
            <EditableText path="eyebrow" value={content.eyebrow} as="p" className="eyebrow" placeholder="Rótulo" />
          </div>
          <div style={{ "--enter-delay": "100ms" } as CSSProperties}>
            <EditableText
              path="title"
              value={content.title}
              as="h1"
              className="max-w-xl text-4xl leading-[1.05] font-extrabold tracking-tight text-balance sm:text-5xl sm:leading-[1.02] md:text-6xl"
              placeholder="Título principal"
              animateWords
            />
          </div>
          <div data-enter style={{ "--enter-delay": "350ms" } as CSSProperties}>
            <EditableText
              path="description"
              value={content.description}
              as="p"
              multiline
              className="max-w-lg text-lg text-muted-foreground"
              placeholder="Descrição"
            />
          </div>
          <div data-enter style={{ "--enter-delay": "500ms" } as CSSProperties}>
            <EditableLink
              path="cta"
              value={content.cta}
              className={buttonVariants({ variant: "highlight", size: "lg" })}
            >
              <ArrowUpRightIcon data-icon="inline-end" />
            </EditableLink>
          </div>
        </div>

        {/* Vídeo sem animação de entrada: no iOS (WebKit), transform/scale em
            ancestrais de um iframe desloca o ponto do toque e os controles do
            player param de responder. */}
        <figure
          data-enter={content.media.type === "image" ? "media" : undefined}
          style={{ "--enter-delay": "150ms" } as CSSProperties}
          className={cn(
            "relative w-full min-w-0 overflow-hidden rounded-3xl border",
            // Vídeo em 16:9 para não aparecer com faixas pretas dentro de um quadrado.
            content.media.type === "video" ? "aspect-video" : "aspect-square",
          )}
        >
          <EditableMedia
            path="media"
            value={content.media}
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
            // TESTE: autoplay desligado temporariamente. Para voltar, adicione `autoplay`.
          />
          {/* Só com imagem: sobre um vídeo, a legenda cobriria os controles do player. */}
          {content.media.type === "image" && (
            <EditableText
              path="mediaCaption"
              value={content.mediaCaption}
              as="figcaption"
              className="pointer-events-none absolute bottom-5 left-5 text-xs text-white/80"
              placeholder="Legenda"
            />
          )}
        </figure>
      </div>
    </section>
  );
}
