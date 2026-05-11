import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StatusConversionCardProps {
  data: { status: string; count: number }[];
}

export function StatusConversionCard({ data }: StatusConversionCardProps) {
  const byStatus = new Map(data.map((item) => [item.status, item.count]));

  const applied = byStatus.get("applied") ?? 0;
  const interview = byStatus.get("interview") ?? 0;
  const offered = byStatus.get("offered") ?? 0;
  const accepted = byStatus.get("accepted") ?? 0;

  const safePercent = (value: number, base: number) =>
    base > 0 ? Math.round((value / base) * 100) : 0;

  const interviewRate = safePercent(interview, applied);
  const offerRate = safePercent(offered, interview);
  const acceptRate = safePercent(accepted, offered);

  const stages = [
    { label: "Applied", count: applied, rate: 100, color: "bg-chart-1" },
    {
      label: "Interview",
      count: interview,
      rate: interviewRate,
      color: "bg-chart-2",
    },
    { label: "Offered", count: offered, rate: offerRate, color: "bg-chart-3" },
    {
      label: "Accepted",
      count: accepted,
      rate: acceptRate,
      color: "bg-chart-4",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Conversion</CardTitle>
        <CardDescription>
          Rasio perpindahan status dari applied ke accepted.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {stages.map((stage) => (
          <div key={stage.label} className="rounded-md border p-3">
            <div className="mb-1 flex items-center justify-between text-sm">
              <p className="text-muted-foreground">{stage.label}</p>
              <div className="flex items-center gap-2">
                <p className="font-semibold tabular-nums">{stage.count}</p>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {stage.rate}%
                </span>
              </div>
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div
                className={`h-2 rounded-full ${stage.color}`}
                style={{ width: `${Math.min(stage.rate, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
