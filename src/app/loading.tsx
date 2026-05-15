import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-12 dark:bg-zinc-950">
      <main className="flex w-full max-w-3xl flex-1 flex-col justify-between gap-16 bg-white px-8 py-20 dark:bg-zinc-950 sm:px-16 sm:py-32">
        <Skeleton className="h-5 w-28" />

        <div className="space-y-6">
          <Skeleton className="h-24 max-w-xs" />
          <div className="space-y-3">
            <Skeleton className="h-5 max-w-md" />
            <Skeleton className="h-5 max-w-sm" />
            <Skeleton className="h-5 max-w-xs" />
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Skeleton className="h-12 w-full rounded-full sm:w-[158px]" />
          <Skeleton className="h-12 w-full rounded-full sm:w-[158px]" />
        </div>
      </main>
    </div>
  );
}
