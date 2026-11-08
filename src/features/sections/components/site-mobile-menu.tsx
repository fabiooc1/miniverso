"use client";

import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type SiteMobileMenuProps = {
  links: { label: string; href: string }[];
};

/** Navegação do site em telas pequenas, onde os links do cabeçalho ficam ocultos. */
export function SiteMobileMenu({ links }: SiteMobileMenuProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Abrir menu" className="md:hidden">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav aria-label="Principal (menu)">
          <ul className="flex flex-col gap-1 px-4">
            {links.map((link) => (
              <li key={link.href}>
                <SheetClose asChild>
                  <Link href={link.href} className="block rounded-lg px-2 py-3 text-lg font-medium hover:text-primary">
                    {link.label}
                  </Link>
                </SheetClose>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
