import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardEmptyState } from "@/features/dashboard/components/dashboard-empty-state";
import {
  BriefcaseBusiness,
  CalendarClock,
  CircleHelp,
  Clock3,
  FileSignature,
  GraduationCap,
  Handshake,
} from "lucide-react";

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

const JOB_TYPE_ICONS = {
  fulltime: BriefcaseBusiness,
  internship: GraduationCap,
  freelance: Handshake,
  parttime: Clock3,
  contract: FileSignature,
  temporary: CalendarClock,
  other: CircleHelp,
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
      <CardContent className="flex-1">
        {ranked.every((item) => item.total === 0) ? (
          <DashboardEmptyState message="Belum ada aktivitas job type." />
        ) : (
          <div className="min-h-56 space-y-3">
            {ranked.map((item) => (
              <Card
                key={item.type}
                className="border-border/60 bg-muted/30 shadow-none"
              >
                <CardContent className="flex items-center gap-3">
                  {(() => {
                    const Icon = JOB_TYPE_ICONS[item.type];

                    return (
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-background text-muted-foreground shadow-sm">
                        <Icon className="size-5" />
                      </div>
                    );
                  })()}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-muted-foreground">
                      {JOB_TYPE_LABELS[item.type]}
                    </p>
                    <p className="text-base font-semibold tabular-nums text-foreground">
                      {item.total} Job Applications
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
