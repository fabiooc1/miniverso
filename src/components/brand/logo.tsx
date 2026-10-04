import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  /** "badge" = fundo violeta (cabeçalhos); "plain" = só a marca (rodapé). */
  variant?: "badge" | "plain";
};

export function Logo({ className, variant = "badge" }: LogoProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-semibold tracking-tight text-white",
        variant === "badge" && "h-10 rounded-lg bg-primary px-4",
        className,
      )}
    >
      <svg viewBox="0 0 28 18" aria-hidden="true" className="h-4 w-auto" fill="none">
        <path
          d="M2 3.5C2 2.67 2.67 2 3.5 2h21c.83 0 1.5.67 1.5 1.5v11c0 .83-.67 1.5-1.5 1.5h-6.2l-2.1-3.2a2.6 2.6 0 0 0-4.4 0L9.7 16H3.5A1.5 1.5 0 0 1 2 14.5v-11Z"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <path d="M2 9h5m14 0h5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
      miniverso
    </span>
  );
}
