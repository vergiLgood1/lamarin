import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { JobApplication } from "@/types";

interface WeeklyPriorityCardProps {
  upcoming: JobApplication[];
}

export function WeeklyPriorityCard({ upcoming }: WeeklyPriorityCardProps) {
  const today = new Date();
  const in3Days = new Date(today);
  in3Days.setDate(today.getDate() + 3);
  const in7Days = new Date(today);
  in7Days.setDate(today.getDate() + 7);

  const toDate = (value: string | null) => (value ? new Date(value) : null);

  const todayCount = upcoming.filter((item) => {
    const date = toDate(item.followUpDate);
    return date ? date.toDateString() === today.toDateString() : false;
  }).length;

  const next3DaysCount = upcoming.filter((item) => {
    const date = toDate(item.followUpDate);
    return date ? date > today && date <= in3Days : false;
  }).length;

  const next7DaysCount = upcoming.filter((item) => {
    const date = toDate(item.followUpDate);
    return date ? date > in3Days && date <= in7Days : false;
  }).length;

  const total = todayCount + next3DaysCount + next7DaysCount;
  const todayPercent = total > 0 ? Math.round((todayCount / total) * 100) : 0;
  const next3Percent = total > 0 ? Math.round((next3DaysCount / total) * 100) : 0;
  const next7Percent = total > 0 ? Math.round((next7DaysCount / total) * 100) : 0;

  return (
    <Card className="lg:col-span-3 h-full">
      <CardHeader>
        <CardTitle>Follow-up Health</CardTitle>
        <CardDescription>
          Distribusi jadwal follow-up untuk 7 hari ke depan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {upcoming.length === 0 ? (
          <div className="flex h-56 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
            Belum ada follow-up terjadwal.
          </div>
        ) : (
          <div className="space-y-3">
            <div className="rounded-md border p-3">
              <div className="mb-1 flex items-center justify-between text-sm">
                <p className="text-muted-foreground">Hari ini</p>
                <p className="font-semibold tabular-nums">{todayCount}</p>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-chart-1"
                  style={{ width: `${todayPercent}%` }}
                />
              </div>
            </div>

            <div className="rounded-md border p-3">
              <div className="mb-1 flex items-center justify-between text-sm">
                <p className="text-muted-foreground">1-3 hari</p>
                <p className="font-semibold tabular-nums">{next3DaysCount}</p>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-chart-2"
                  style={{ width: `${next3Percent}%` }}
                />
              </div>
            </div>

            <div className="rounded-md border p-3">
              <div className="mb-1 flex items-center justify-between text-sm">
                <p className="text-muted-foreground">4-7 hari</p>
                <p className="font-semibold tabular-nums">{next7DaysCount}</p>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-chart-3"
                  style={{ width: `${next7Percent}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
