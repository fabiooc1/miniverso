import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PublicCategoryFilterProps = {
  categories: { name: string; slug: string }[];
  active?: string;
};

export function PublicCategoryFilter({ categories, active }: PublicCategoryFilterProps) {
  const chips = [{ name: "Todos", slug: undefined }, ...categories];

  return (
    <nav aria-label="Filtrar por categoria" className="flex flex-wrap items-center gap-2.5">
      {chips.map((chip) => {
        const isActive = chip.slug === active;
        return (
          <Link
            key={chip.slug ?? "todos"}
            href={chip.slug ? `/blog?categoria=${chip.slug}` : "/blog"}
            scroll={false}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              buttonVariants({ size: "sm", variant: isActive ? "default" : "ghost" }),
              "px-4 font-normal",
              !isActive && "bg-card",
            )}
          >
            {chip.name}
          </Link>
        );
      })}
    </nav>
  );
}
