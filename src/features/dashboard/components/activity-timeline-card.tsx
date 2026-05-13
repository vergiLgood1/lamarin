import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/features/applications/components/status-badge";
import { DashboardEmptyState } from "@/features/dashboard/components/dashboard-empty-state";
import type { JobApplication } from "@/types";

interface ActivityTimelineCardProps {
  applications: JobApplication[];
}

export function ActivityTimelineCard({ applications }: ActivityTimelineCardProps) {
  const visibleApplications = applications.slice(0, 4);
  const emptySlots = Math.max(0, 4 - visibleApplications.length);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Activity Timeline</CardTitle>
        <CardDescription>
          Aktivitas terbaru dari aplikasi yang baru ditambahkan.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {applications.length === 0 ? (
          <DashboardEmptyState message="Belum ada aktivitas terbaru." />
        ) : (
          <div className="min-h-56 space-y-3">
            {visibleApplications.map((application) => (
              <div key={application.id} className="rounded-md border p-3">
                <p className="text-sm font-medium">{application.companyName}</p>
                <p className="text-xs text-muted-foreground">
                  {application.position}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {application.applicationDate}
                  </p>
                  <StatusBadge status={application.status} />
                </div>
              </div>
            ))}
            {Array.from({ length: emptySlots }).map((_, index) => (
              <div
                key={`activity-placeholder-${index}`}
                aria-hidden="true"
                className="invisible rounded-md border p-3"
              >
                <p className="text-sm font-medium">Placeholder</p>
                <p className="text-xs text-muted-foreground">Placeholder</p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Placeholder</p>
                  <span className="rounded-full px-2 py-0.5 text-xs">
                    Placeholder
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
