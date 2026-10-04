"use client";

import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { buttonVariants } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { POST_SORTS, type PostSort } from "../schemas";

type CategoryChip = { name: string; slug: string };

const SEARCH_DEBOUNCE_MS = 300;

/** Atualiza um parâmetro da URL preservando os demais. */
function useSearchParamUpdater() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function hrefWith(name: string, value: string | null) {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(name, value);
    else params.delete(name);
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  function replace(name: string, value: string | null) {
    startTransition(() => router.replace(hrefWith(name, value), { scroll: false }));
  }

  return { searchParams, hrefWith, replace, isPending };
}

export function PostSearch() {
  const { searchParams, replace, isPending } = useSearchParamUpdater();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    if (query === (searchParams.get("q") ?? "")) return;
    const timeout = setTimeout(() => replace("q", query.trim() || null), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
    // `replace` muda a cada render; o efeito deve reagir apenas ao texto.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <InputGroup className="h-10 flex-1">
      <InputGroupAddon>{isPending ? <Spinner /> : <SearchIcon />}</InputGroupAddon>
      <InputGroupInput
        type="search"
        value={query}
        placeholder="Buscar por título, categoria ou autor"
        aria-label="Buscar posts"
        onChange={(event) => setQuery(event.target.value)}
      />
    </InputGroup>
  );
}

export function CategoryFilter({ categories }: { categories: CategoryChip[] }) {
  const { searchParams, hrefWith } = useSearchParamUpdater();
  const active = searchParams.get("categoria");

  const chips = [{ name: "Todas", slug: null }, ...categories];

  return (
    <nav aria-label="Filtrar por categoria" className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold text-muted-foreground uppercase">Categoria:</span>
      {chips.map((chip) => {
        const isActive = chip.slug === active;
        return (
          <Link
            key={chip.slug ?? "todas"}
            href={hrefWith("categoria", chip.slug)}
            scroll={false}
            aria-current={isActive ? "page" : undefined}
            className={cn(buttonVariants({ size: "sm", variant: isActive ? "default" : "secondary" }), "px-3")}
          >
            {chip.name}
          </Link>
        );
      })}
    </nav>
  );
}

export function PostSortSelect({ value }: { value: PostSort }) {
  const { replace } = useSearchParamUpdater();

  return (
    <Select value={value} onValueChange={(sort) => replace("ordem", sort === "recentes" ? null : sort)}>
      <SelectTrigger size="sm" aria-label="Ordenar por" className="rounded-full bg-card">
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        <SelectGroup>
          {Object.entries(POST_SORTS).map(([sort, label]) => (
            <SelectItem key={sort} value={sort}>
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
