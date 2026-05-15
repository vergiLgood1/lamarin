import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="rounded-xl border p-6 shadow-xs">
      <div className="space-y-2 text-center">
        <Skeleton className="mx-auto h-8 w-36" />
        <Skeleton className="mx-auto h-4 w-40" />
      </div>

      <div className="mt-6 space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-full" />
          </div>
        ))}
        <Skeleton className="h-8 w-full rounded-lg" />
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Skeleton className="h-px flex-1" />
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-px flex-1" />
      </div>

      <Skeleton className="mt-4 h-8 w-full rounded-lg" />
      <Skeleton className="mx-auto mt-6 h-4 w-48" />
    </div>
  );
}
