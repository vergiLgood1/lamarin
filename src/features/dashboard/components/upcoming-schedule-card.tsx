import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardEmptyState } from "@/features/dashboard/components/dashboard-empty-state";
import type { JobApplication } from "@/types";
import Link from "next/link";

interface UpcomingScheduleCardProps {
  applications: JobApplication[];
}

export function UpcomingScheduleCard({ applications }: UpcomingScheduleCardProps) {
  const visibleApplications = applications.slice(0, 4);
  const emptySlots = Math.max(0, 4 - visibleApplications.length);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Schedule</CardTitle>
        <CardDescription>
          Daftar jadwal terdekat yang perlu ditindaklanjuti.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {applications.length > 0 ? (
          <div className="min-h-63 space-y-3">
            {visibleApplications.map((application) => (
              <Link
                key={application.id}
                href={`/dashboard/applications/${application.id}`}
                className="block rounded-lg border p-3 transition-colors hover:bg-muted/40"
              >
                <p className="text-sm font-medium">{application.companyName}</p>
                <p className="text-xs text-muted-foreground">
                  {application.position}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Follow-up: {application.followUpDate}
                </p>
              </Link>
            ))}
            {Array.from({ length: emptySlots }).map((_, index) => (
              <div
                key={`schedule-placeholder-${index}`}
                aria-hidden="true"
                className="invisible rounded-lg border p-3"
              >
                <p className="text-sm font-medium">Placeholder</p>
                <p className="text-xs text-muted-foreground">Placeholder</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Follow-up: Placeholder
                </p>
              </div>
            ))}
          </div>
        ) : (
          <DashboardEmptyState
            className="min-h-63"
            message="Belum ada jadwal follow-up."
          />
        )}
      </CardContent>
    </Card>
  );
}
