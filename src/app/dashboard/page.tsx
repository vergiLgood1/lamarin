import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { getApplications } from "@/features/applications/actions/queries";
import {
  getDashboardStats,
  getJobTypeActivity,
  getTopAppliedPositions,
} from "@/features/dashboard/actions/queries";
import { ActivityChart } from "@/features/dashboard/components/activity-chart";
import { ActivityTimelineCard } from "@/features/dashboard/components/activity-timeline-card";
import { ApplicationSummaryCard } from "@/features/dashboard/components/application-summary-card";
import { ApplicationsTableCard } from "@/features/dashboard/components/applications-table-card";
import { DashboardPageHeader } from "@/features/dashboard/components/dashboard-page-header";
import { JobTypeOverviewCard } from "@/features/dashboard/components/job-type-overview-card";
import { StatusChart } from "@/features/dashboard/components/status-chart";
import { TopPositionsRadialChart } from "@/features/dashboard/components/top-positions-radial-chart";
import { TopSourcesCard } from "@/features/dashboard/components/top-sources-card";
import { UpcomingScheduleCard } from "@/features/dashboard/components/upcoming-schedule-card";
import { WeeklyPriorityCard } from "@/features/dashboard/components/weekly-priority-card";
import { getStatusMetrics } from "@/features/dashboard/lib/status-metrics";

export default async function DashboardPage() {
  const [stats, activity, topAppliedPositions, applications] =
    await Promise.all([
      getDashboardStats(),
      getJobTypeActivity(),
      getTopAppliedPositions(),
      getApplications({
        limit: 8,
        sortBy: "applicationDate",
        sortOrder: "desc",
      }),
    ]);

  const statusMetrics = getStatusMetrics(stats.statusBreakdown);

  return (
    <div className="space-y-6">
      <DashboardPageHeader />

      <div className="grid items-start gap-4 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-7">
          <ApplicationSummaryCard
            appliedCount={statusMetrics.appliedCount}
            interviewCount={statusMetrics.interviewCount}
            rejectedCount={statusMetrics.rejectedCount}
          />

          <ActivityChart data={activity} />

          <div className="grid gap-4 md:grid-cols-2">
            <TopSourcesCard data={stats.topSources} />
            <JobTypeOverviewCard data={activity} />
          </div>
        </div>

        <div className="space-y-4 xl:col-span-5">
          <Card className="h-full">
            {/* <CardHeader>
              <CardTitle className="sr-only">Kalender</CardTitle>
              <CardDescription className="sr-only">
                Jadwal follow-up dan interview mendatang
              </CardDescription>
            </CardHeader> */}
            <CardContent className="flex justify-center">
              <Calendar mode="single" selected={new Date()} className="p-0" />
            </CardContent>
          </Card>

          <UpcomingScheduleCard applications={stats.upcomingFollowUps} />

          <TopPositionsRadialChart data={topAppliedPositions} />
        </div>
      </div>

      <div className="grid items-stretch gap-4 lg:grid-cols-12">
        <div className="grid gap-4 md:grid-cols-1 lg:col-span-3">
          {/* <StatusConversionCard data={stats.statusBreakdown} /> */}
          <StatusChart data={stats.statusBreakdown} />
        </div>
        <div className="lg:col-span-9">
          <WeeklyPriorityCard upcoming={stats.upcomingFollowUps} />
        </div>
      </div>

      <div className="grid items-stretch gap-4 lg:grid-cols-7">
        <div className="lg:col-span-2">
          <ActivityTimelineCard applications={applications.data} />
        </div>
        <div className="lg:col-span-5">
          <ApplicationsTableCard applications={applications.data} />
        </div>
      </div>
    </div>
  );
}
