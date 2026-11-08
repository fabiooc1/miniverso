import { Skeleton } from "@/components/ui/skeleton";

export default function BlogPostLoading() {
  return (
    <main className="site-container flex flex-1 flex-col gap-12 pt-14 pb-16 md:pt-20">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-14 w-full max-w-3xl" />
        <Skeleton className="h-4 w-56" />
      </div>
      <Skeleton className="aspect-[7/6] rounded-3xl md:aspect-[2/1]" />
    </main>
  );
}
