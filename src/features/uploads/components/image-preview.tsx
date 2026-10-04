import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { getFileUrl } from "@/lib/storage/keys";
import { cn } from "@/lib/utils";

type ImagePreviewProps = {
  imageKey: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
};

/**
 * Imagem do storage preenchendo o contêiner pai (que deve ser `relative`).
 * Sem imagem, mostra um placeholder com o gradiente da marca.
 */
export function ImagePreview({ imageKey, alt, sizes, className, priority }: ImagePreviewProps) {
  if (!imageKey) {
    return (
      <div
        role="img"
        aria-label={alt || "Imagem não definida"}
        className={cn(
          "absolute inset-0 flex items-center justify-center bg-linear-135 from-primary/70 via-brand-night to-highlight/40 text-white/50",
          className,
        )}
      >
        <ImageIcon className="size-10" />
      </div>
    );
  }

  return (
    <Image
      src={getFileUrl(imageKey)}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn("object-cover", className)}
    />
  );
}
