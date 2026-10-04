import { cn } from "@/lib/utils";
import { EditableText } from "../editable/editable-text";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  className?: string;
  titleClassName?: string;
};

/** Rótulo em caixa alta + título, padrão das seções da landing. */
export function SectionHeading({ eyebrow, title, className, titleClassName }: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <EditableText path="eyebrow" value={eyebrow} as="p" className="eyebrow" placeholder="Rótulo" />
      <EditableText
        path="title"
        value={title}
        as="h2"
        className={cn("max-w-3xl text-3xl leading-tight tracking-tight text-balance md:text-4xl", titleClassName)}
        placeholder="Título da seção"
      />
    </div>
  );
}
