import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, FileEdit, Clock, Send } from "lucide-react";

interface FollowUpStatsCardsProps {
  total: number;
  draft: number;
  scheduled: number;
  sent: number;
}

export function FollowUpStatsCards({
  total,
  draft,
  scheduled,
  sent,
}: FollowUpStatsCardsProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Emails
          </CardTitle>
          <Mail className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tabular-nums">{total}</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Semua email follow-up
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Draft
          </CardTitle>
          <FileEdit className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tabular-nums">{draft}</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Email yang belum dikirim
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Scheduled
          </CardTitle>
          <Clock className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tabular-nums">{scheduled}</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Email terjadwal
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Sent
          </CardTitle>
          <Send className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tabular-nums">{sent}</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Email terkirim
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
