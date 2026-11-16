"use client";

import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, type MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { scrollToSection } from "./scroll-to-section";

type SiteMobileMenuProps = {
  links: { label: string; href: string }[];
  activeHref?: string | null;
};

/**
 * Navegação do site em telas pequenas, onde os links do cabeçalho ficam ocultos.
 *
 * Enquanto aberto, o Sheet trava a rolagem da página e, ao fechar, devolve o
 * foco ao botão do menu (no topo). Por isso a rolagem até uma seção da própria
 * página só acontece depois que o menu termina de fechar, sem devolver o foco.
 */
export function SiteMobileMenu({ links, activeHref }: SiteMobileMenuProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const pendingSection = useRef<string | null>(null);

  function handleLinkClick(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (pathname === "/" && href.startsWith("/#")) {
      event.preventDefault();
      pendingSection.current = href;
    }
    setOpen(false);
  }

  function handleCloseAutoFocus(event: Event) {
    const href = pendingSection.current;
    if (!href) return;
    pendingSection.current = null;
    event.preventDefault();
    scrollToSection(href, pathname);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Abrir menu" className="md:hidden">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" onCloseAutoFocus={handleCloseAutoFocus}>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav aria-label="Principal (menu)">
          <ul className="flex flex-col gap-1 px-4">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={(event) => handleLinkClick(event, link.href)}
                  aria-current={link.href === activeHref ? "location" : undefined}
                  className={cn(
                    "block rounded-lg px-2 py-3 text-lg font-medium hover:text-primary",
                    link.href === activeHref && "bg-secondary text-primary",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
