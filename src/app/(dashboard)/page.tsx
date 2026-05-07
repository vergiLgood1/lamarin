import { getDashboardStats, getMonthlyTrend } from "@/actions/dashboard/queries";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { StatusChart } from "@/components/dashboard/status-chart";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { RecentApplications } from "@/components/dashboard/recent-applications";

export default async function DashboardPage() {
  const [stats, trend] = await Promise.all([
    getDashboardStats(),
    getMonthlyTrend(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Ringkasan aktivitas lamaran kerja Anda
        </p>
      </div>

      <StatsCards
        totalApplications={stats.totalApplications}
        thisMonth={stats.thisMonth}
        lastMonth={stats.lastMonth}
        upcomingFollowUps={stats.upcomingFollowUps.length}
      />

      <div className="grid gap-4 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <TrendChart data={trend} />
        </div>
        <div className="lg:col-span-3">
          <StatusChart data={stats.statusBreakdown} />
        </div>
      </div>

      <RecentApplications applications={stats.upcomingFollowUps} />
    </div>
  );
}
