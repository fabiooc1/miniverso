import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "./page-container";

/** Estado de carregamento padrão das páginas do painel. */
export function PageSkeleton() {
  return (
    <PageContainer>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-9 w-64" />
      </div>
      <Skeleton className="h-28 w-full rounded-xl" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    </PageContainer>
  );
}
