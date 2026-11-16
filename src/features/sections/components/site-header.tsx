"use client";

import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { scrollToSection } from "./scroll-to-section";
import { SiteMobileMenu } from "./site-mobile-menu";
import { useActiveSection } from "./use-active-section";

const NAV_LINKS = [
  { label: "Serviços", href: "/#servicos" },
  { label: "Projetos", href: "/#projetos" },
  { label: "Blog", href: "/blog" },
  { label: "Contato", href: "/#contato" },
];

const SECTION_IDS = NAV_LINKS.filter((link) => link.href.startsWith("/#")).map((link) => link.href.slice(2));

type SiteHeaderProps = {
  /** "dark" = sobre o hero da landing; "light" = páginas de fundo claro (blog). */
  tone?: "dark" | "light";
  /**
   * Página em que o cabeçalho está, para destacar o link ativo. Vem por prop
   * (e não de `usePathname`) para não bloquear o pré-render de rotas dinâmicas
   * como `/blog/[slug]` com Cache Components.
   */
  page?: "landing" | "blog";
};

/** Cabeçalho do site. Não é editável: a navegação aponta para as âncoras das seções. */
export function SiteHeader({ tone = "dark", page = "landing" }: SiteHeaderProps) {
  const activeHref = useActiveHref(page);

  return (
    <header className={cn(tone === "dark" && "dark")}>
      <div className="site-container flex h-20 items-center justify-between gap-6">
        <Link href="/" aria-label="Miniverso — início">
          <Logo />
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-8">
          <ul className="hidden items-center gap-8 text-sm font-medium md:flex">
            {NAV_LINKS.map((link) => {
              const active = link.href === activeHref;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={(event) => {
                      if (scrollToSection(link.href)) event.preventDefault();
                    }}
                    aria-current={active ? "location" : undefined}
                    className={cn(
                      "relative py-1 transition-colors hover:text-primary dark:hover:text-highlight",
                      // Sublinhado que cresce a partir do centro no link ativo.
                      "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-center after:scale-x-0 after:rounded-full after:bg-primary after:transition-transform after:duration-300 dark:after:bg-highlight",
                      active && "text-primary after:scale-x-100 dark:text-highlight",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href="/#contato"
            onClick={(event) => {
              if (scrollToSection("/#contato")) event.preventDefault();
            }}
            className={cn(buttonVariants({ variant: "highlight" }), "hidden md:inline-flex")}
          >
            Fale com a gente
            <ArrowUpRightIcon data-icon="inline-end" />
          </Link>
          <SiteMobileMenu links={NAV_LINKS} activeHref={activeHref} />
        </nav>
      </div>
    </header>
  );
}

/** Link da navegação correspondente à página ou à seção visível. */
function useActiveHref(page: NonNullable<SiteHeaderProps["page"]>) {
  const activeSection = useActiveSection(page === "landing" ? SECTION_IDS : []);

  if (page === "blog") return "/blog";
  return activeSection ? `/#${activeSection}` : null;
}
