"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BriefcaseBusiness, GraduationCap, Handshake } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface ActivityChartProps {
  data: {
    month: string;
    fulltime: number;
    parttime: number;
    internship: number;
    freelance: number;
    contract: number;
    temporary: number;
    other: number;
  }[];
}

const chartConfig = {
  fulltime: { label: "Full-time", color: "#facc15", icon: BriefcaseBusiness },
  internship: { label: "Internship", color: "#7dd3fc", icon: GraduationCap },
  freelance: { label: "Freelance", color: "#fda4af", icon: Handshake },
};

const ACTIVE_TYPES = ["fulltime", "internship", "freelance"] as const;

export function ActivityChart({ data }: ActivityChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    label: item.month.slice(5),
  }));

  const totals = ACTIVE_TYPES.map((type) => ({
    type,
    total: chartData.reduce((sum, item) => sum + item[type], 0),
  }));

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Job Type Activity</CardTitle>
          <CardDescription>
            Aktivitas lamaran berdasarkan jenis pekerjaan (6 bulan terakhir)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex h-[220px] items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
            Belum ada data aktivitas job type
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Type Activity</CardTitle>
        <CardDescription>
          Aktivitas lamaran berdasarkan jenis pekerjaan (6 bulan terakhir)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ChartContainer config={chartConfig} className="h-[220px] w-full">
          <AreaChart data={chartData} margin={{ left: 0, right: 0, top: 8 }}>
            <defs>
              <linearGradient id="fillFulltime" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#facc15" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#facc15" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fillInternship" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7dd3fc" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#7dd3fc" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fillFreelance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fda4af" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#fda4af" stopOpacity={0.04} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />

            <Area
              type="monotone"
              dataKey="freelance"
              stroke="#fda4af"
              fill="url(#fillFreelance)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="internship"
              stroke="#7dd3fc"
              fill="url(#fillInternship)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="fulltime"
              stroke="#facc15"
              fill="url(#fillFulltime)"
              strokeWidth={2.5}
            />
          </AreaChart>
        </ChartContainer>

        <div className="grid gap-3 sm:grid-cols-3">
          {totals.map((item) => {
            const Icon = chartConfig[item.type].icon;

            return (
              <Card
                key={item.type}
                size="sm"
                className="gap-2 bg-muted/30 py-3"
              >
                <CardHeader className="flex items-center gap-2 justify-between">
                  <CardTitle className="text-xs text-muted-foreground">
                    {chartConfig[item.type].label}
                  </CardTitle>
                  <Icon
                    className="h-4 w-4"
                    style={{ color: chartConfig[item.type].color }}
                  />
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold tabular-nums">
                      {item.total}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
