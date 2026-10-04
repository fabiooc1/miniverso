import { Skeleton } from "@/components/ui/skeleton";

export function LandingEditorSkeleton() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between border-b px-6 py-4 md:px-10">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-7 w-48" />
        </div>
        <Skeleton className="h-9 w-44 rounded-full" />
      </div>
      <div className="p-4 md:p-6">
        <Skeleton className="h-[70svh] w-full rounded-2xl" />
      </div>
    </div>
  );
}
