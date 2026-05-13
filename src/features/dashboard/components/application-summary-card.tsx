import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatsCards } from "@/features/dashboard/components/stats-cards";
import Link from "next/link";

interface ApplicationSummaryCardProps {
  appliedCount: number;
  interviewCount: number;
  rejectedCount: number;
}

export function ApplicationSummaryCard({
  appliedCount,
  interviewCount,
  rejectedCount,
}: ApplicationSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Ringkasan Lamaran</CardTitle>
          <CardDescription>
            Snapshot metrik utama untuk performa pencarian kerja.
          </CardDescription>
        </div>
        <CardAction>
          <Link
            href="/dashboard/applications/new"
            className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Tambah Lamaran
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent className="flex-1">
        <StatsCards
          appliedCount={appliedCount}
          interviewCount={interviewCount}
          rejectedCount={rejectedCount}
        />
      </CardContent>
    </Card>
  );
}
