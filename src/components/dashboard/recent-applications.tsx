import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { JobApplication } from "@/types";
import { StatusBadge } from "@/components/applications/status-badge";

interface RecentApplicationsProps {
  applications: JobApplication[];
}

export function RecentApplications({ applications }: RecentApplicationsProps) {
  if (applications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Follow-up Mendatang</CardTitle>
          <CardDescription>Lamaran yang perlu ditindaklanjuti</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Tidak ada follow-up yang dijadwalkan
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Follow-up Mendatang</CardTitle>
        <CardDescription>Lamaran yang perlu ditindaklanjuti</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {applications.map((app) => (
            <Link
              key={app.id}
              href={`/applications/${app.id}`}
              className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="space-y-0.5">
                <p className="text-sm font-medium">{app.companyName}</p>
                <p className="text-xs text-muted-foreground">{app.position}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={app.status} />
                <span className="text-xs text-muted-foreground">
                  {app.followUpDate}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
