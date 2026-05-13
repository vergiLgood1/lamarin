import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function CardHeadingSkeleton() {
  return (
    <CardHeader>
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-4 w-64 max-w-full" />
    </CardHeader>
  );
}

function ChartCardSkeleton({ height = "h-56" }: { height?: string }) {
  return (
    <Card className="h-full">
      <CardHeadingSkeleton />
      <CardContent className="flex-1">
        <Skeleton className={`${height} w-full`} />
      </CardContent>
    </Card>
  );
}

function ListCardSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <Card className="h-full">
      <CardHeadingSkeleton />
      <CardContent className="flex-1 space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} className="h-[72px] w-full" />
        ))}
      </CardContent>
    </Card>
  );
}

function SummaryCardSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader className="grid grid-cols-[1fr_auto] gap-3">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <Skeleton className="h-9 w-32" />
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-[116px] w-full" />
        ))}
      </CardContent>
    </Card>
  );
}

function CalendarSkeleton() {
  return (
    <Card className="h-full">
      <CardContent className="flex justify-center">
        <Skeleton className="h-[332px] w-full max-w-[332px]" />
      </CardContent>
    </Card>
  );
}

function TableCardSkeleton() {
  return (
    <Card className="flex h-full flex-col">
      <CardHeadingSkeleton />
      <CardContent className="min-h-0 flex-1 space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[52vh] min-h-[260px] w-full lg:h-full" />
      </CardContent>
    </Card>
  );
}

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-7">
          <SummaryCardSkeleton />
          <ChartCardSkeleton height="h-[336px]" />
          <div className="grid gap-4 md:grid-cols-2">
            <ChartCardSkeleton />
            <ListCardSkeleton />
          </div>
        </div>

        <div className="space-y-4 lg:col-span-5">
          <CalendarSkeleton />
          <ListCardSkeleton />
          <ChartCardSkeleton />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-7">
          <ChartCardSkeleton />
        </div>
        <div className="space-y-4 lg:col-span-5">
          <ListCardSkeleton rows={3} />
        </div>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-7">
        <div className="h-full lg:col-span-2">
          <ListCardSkeleton />
        </div>
        <div className="h-full lg:col-span-5">
          <TableCardSkeleton />
        </div>
      </div>
    </div>
  );
}
