import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-52" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Top Section */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Left */}
        <div className="space-y-4 lg:col-span-7">
          {/* Summary Card */}
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>

          {/* Activity Chart */}
          <Skeleton className="h-[320px] rounded-2xl" />

          {/* Status + Job Type */}
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-[260px] rounded-2xl" />
            <Skeleton className="h-[260px] rounded-2xl" />
          </div>
        </div>

        {/* Right */}
        <div className="space-y-4 lg:col-span-5">
          <Skeleton className="h-[360px] rounded-2xl" />
          <Skeleton className="h-[180px] rounded-2xl" />
          <Skeleton className="h-[280px] rounded-2xl" />
        </div>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-7">
          <Skeleton className="h-[260px] rounded-2xl" />
        </div>

        <div className="space-y-4 lg:col-span-5">
          <Skeleton className="h-[260px] rounded-2xl" />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-7">
        <div className="lg:col-span-2">
          <Skeleton className="h-[420px] rounded-2xl" />
        </div>

        <div className="lg:col-span-5">
          <Skeleton className="h-[420px] rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
