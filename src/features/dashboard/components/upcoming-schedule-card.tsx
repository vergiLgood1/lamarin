import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { JobApplication } from "@/types";
import Link from "next/link";

interface UpcomingScheduleCardProps {
  applications: JobApplication[];
}

export function UpcomingScheduleCard({ applications }: UpcomingScheduleCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Schedule</CardTitle>
        <CardDescription>
          Daftar jadwal terdekat yang perlu ditindaklanjuti.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {applications.length > 0 ? (
          <div className="space-y-3">
            {applications.slice(0, 4).map((application) => (
              <Link
                key={application.id}
                href={`/dashboard/applications/${application.id}`}
                className="block rounded-lg border p-3 transition-colors hover:bg-muted/40"
              >
                <p className="text-sm font-medium">{application.companyName}</p>
                <p className="text-xs text-muted-foreground">{application.position}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Follow-up: {application.followUpDate}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex h-24 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
            Belum ada jadwal follow-up.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
