import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, CalendarClock, FileText, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  totalApplications: number;
  thisMonth: number;
  lastMonth: number;
  upcomingFollowUps: number;
}

export function StatsCards({
  totalApplications,
  thisMonth,
  lastMonth,
  upcomingFollowUps,
}: StatsCardsProps) {
  const monthChange =
    lastMonth > 0
      ? ((thisMonth - lastMonth) / lastMonth) * 100
      : thisMonth > 0
        ? 100
        : 0;

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Lamaran
          </CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tabular-nums">
            {totalApplications}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Semua lamaran tercatat
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Bulan Ini
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tabular-nums">{thisMonth}</div>
          <p className="mt-1 text-xs text-muted-foreground">
            {monthChange > 0 && (
              <span className="text-emerald-600 dark:text-emerald-400">
                +{monthChange.toFixed(0)}%
              </span>
            )}
            {monthChange < 0 && (
              <span className="text-red-600 dark:text-red-400">
                {monthChange.toFixed(0)}%
              </span>
            )}
            {monthChange === 0 && <span>Sama</span>} dari bulan lalu
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Bulan Lalu
          </CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tabular-nums">{lastMonth}</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Lamaran bulan sebelumnya
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Follow-up
          </CardTitle>
          <CalendarClock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tabular-nums">
            {upcomingFollowUps}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Perlu ditindaklanjuti
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
