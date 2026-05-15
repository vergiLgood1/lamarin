import {
  getFollowUpStats,
  getFollowUpTrend,
  getFollowUpEmails,
} from "@/features/follow-up/actions/queries";
import { FollowUpStatsCards } from "@/features/follow-up/components/follow-up-stats-cards";
import { FollowUpTrendChart } from "@/features/follow-up/components/follow-up-trend-chart";
import { FollowUpEmailsTable } from "@/features/follow-up/components/follow-up-emails-table";

export default async function FollowUpOverviewPage() {
  const [stats, trend, emails] = await Promise.all([
    getFollowUpStats(),
    getFollowUpTrend(),
    getFollowUpEmails(),
  ]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Follow-up Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Riwayat email follow-up Anda. Buat email baru lewat tombol Add.
        </p>
      </div>

      {/* Row 1: 4 Stats Cards */}
      <FollowUpStatsCards
        total={stats.total}
        draft={stats.draft}
        scheduled={stats.scheduled}
        sent={stats.sent}
      />

      {/* Row 2: Trend Chart */}
      <FollowUpTrendChart data={trend} />

      {/* Row 3: Emails Table */}
      <FollowUpEmailsTable emails={emails} />
    </div>
  );
}
