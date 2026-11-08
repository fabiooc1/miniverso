import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SiteMobileMenu } from "./site-mobile-menu";

const NAV_LINKS = [
  { label: "Serviços", href: "/#servicos" },
  { label: "Projetos", href: "/#projetos" },
  { label: "Blog", href: "/blog" },
  { label: "Contato", href: "/#contato" },
];

type SiteHeaderProps = {
  /** "dark" = sobre o hero da landing; "light" = páginas de fundo claro (blog). */
  tone?: "dark" | "light";
};

/** Cabeçalho do site. Não é editável: a navegação aponta para as âncoras das seções. */
export function SiteHeader({ tone = "dark" }: SiteHeaderProps) {
  return (
    <header className={cn(tone === "dark" && "dark")}>
      <div className="site-container flex h-20 items-center justify-between gap-6">
        <Link href="/" aria-label="Miniverso — início">
          <Logo />
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-8">
          <ul className="hidden items-center gap-8 text-sm font-medium md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-primary dark:hover:text-highlight">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/#contato" className={cn(buttonVariants({ variant: "highlight" }), "hidden md:inline-flex")}>
            Fale com a gente
            <ArrowUpRightIcon data-icon="inline-end" />
          </Link>
          <SiteMobileMenu links={NAV_LINKS} />
        </nav>
      </div>
    </header>
  );
}
