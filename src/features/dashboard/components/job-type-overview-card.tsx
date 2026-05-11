import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface JobTypeActivityItem {
  month: string;
  fulltime: number;
  parttime: number;
  internship: number;
  freelance: number;
  contract: number;
  temporary: number;
  other: number;
}

interface JobTypeOverviewCardProps {
  data: JobTypeActivityItem[];
}

const JOB_TYPE_LABELS = {
  fulltime: "Full-time",
  internship: "Internship",
  freelance: "Freelance",
  parttime: "Part-time",
  contract: "Contract",
  temporary: "Temporary",
  other: "Other",
} as const;

export function JobTypeOverviewCard({ data }: JobTypeOverviewCardProps) {
  const totals = data.reduce(
    (acc, item) => ({
      fulltime: acc.fulltime + item.fulltime,
      internship: acc.internship + item.internship,
      freelance: acc.freelance + item.freelance,
      parttime: acc.parttime + item.parttime,
      contract: acc.contract + item.contract,
      temporary: acc.temporary + item.temporary,
      other: acc.other + item.other,
    }),
    {
      fulltime: 0,
      internship: 0,
      freelance: 0,
      parttime: 0,
      contract: 0,
      temporary: 0,
      other: 0,
    }
  );

  const ranked = Object.entries(totals)
    .map(([type, total]) => ({ type: type as keyof typeof JOB_TYPE_LABELS, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 4);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Type Overview</CardTitle>
        <CardDescription>
          Komposisi jenis pekerjaan yang paling sering Anda apply.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {ranked.every((item) => item.total === 0) ? (
          <div className="flex h-28 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
            Belum ada aktivitas job type.
          </div>
        ) : (
          <div className="space-y-2">
            {ranked.map((item) => (
              <div
                key={item.type}
                className="flex items-center justify-between rounded-md border px-3 py-2"
              >
                <p className="text-sm text-muted-foreground">{JOB_TYPE_LABELS[item.type]}</p>
                <p className="text-sm font-semibold tabular-nums">{item.total}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
