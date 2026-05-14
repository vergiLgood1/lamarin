import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, CircleX, MessageCircleQuestion } from "lucide-react";

interface StatsCardsProps {
  appliedCount: number;
  interviewCount: number;
  rejectedCount: number;
}

export function StatsCards({
  appliedCount,
  interviewCount,
  rejectedCount,
}: StatsCardsProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Applied
          </CardTitle>
          <Briefcase className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tabular-nums">{appliedCount}</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Lamaran yang sudah dikirim
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Interview
          </CardTitle>
          <MessageCircleQuestion className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tabular-nums">{interviewCount}</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Lamaran di tahap interview
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Rejected
          </CardTitle>
          <CircleX className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tabular-nums">{rejectedCount}</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Lamaran yang ditolak
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
