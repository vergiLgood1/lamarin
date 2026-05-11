import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/features/applications/components/status-badge";
import type { JobApplication } from "@/types";

interface ActivityTimelineCardProps {
  applications: JobApplication[];
}

export function ActivityTimelineCard({ applications }: ActivityTimelineCardProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Activity Timeline</CardTitle>
        <CardDescription>
          Aktivitas terbaru dari aplikasi yang baru ditambahkan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {applications.length === 0 ? (
          <div className="flex h-56 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
            Belum ada aktivitas terbaru.
          </div>
        ) : (
          <div className="space-y-3">
            {applications.slice(0, 5).map((application) => (
              <div key={application.id} className="rounded-md border p-3">
                <p className="text-sm font-medium">{application.companyName}</p>
                <p className="text-xs text-muted-foreground">{application.position}</p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {application.applicationDate}
                  </p>
                  <StatusBadge status={application.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
