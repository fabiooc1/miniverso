import Image from "next/image";
import { cn } from "@/lib/utils";
import logoHorizontal from "../../../docs/identidade/logo-horizontal-branco.png";

type LogoProps = {
  className?: string;
  /** "badge" = fundo violeta (cabeçalhos); "plain" = só a marca (rodapé). */
  variant?: "badge" | "plain";
};

/** Logotipo horizontal branco: só funciona sobre fundo violeta ou escuro. */
export function Logo({ className, variant = "badge" }: LogoProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center",
        variant === "badge" && "h-10 rounded-lg bg-primary px-4",
        className,
      )}
    >
      <Image src={logoHorizontal} alt="Miniverso" className="h-5 w-auto" />
    </span>
  );
}
