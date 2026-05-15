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
import { DashboardEmptyState } from "@/features/dashboard/components/dashboard-empty-state";
import { Mail, FileEdit, Clock, Send } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface FollowUpTrendChartProps {
  data: {
    month: string;
    draft: number;
    scheduled: number;
    sent: number;
    failed: number;
  }[];
}

const chartConfig = {
  sent: { label: "Sent", color: "#10b981", icon: Send },
  scheduled: { label: "Scheduled", color: "#3b82f6", icon: Clock },
  draft: { label: "Draft", color: "#f59e0b", icon: FileEdit },
};

const ACTIVE_STATUSES = ["sent", "scheduled", "draft"] as const;

export function FollowUpTrendChart({ data }: FollowUpTrendChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    label: item.month.slice(5),
  }));

  const totals = ACTIVE_STATUSES.map((status) => ({
    status,
    total: chartData.reduce((sum, item) => sum + item[status], 0),
  }));

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Follow-Up Trend</CardTitle>
          <CardDescription>
            Trend email follow-up berdasarkan status (6 bulan terakhir)
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 space-y-4">
          <DashboardEmptyState
            className="min-h-[336px]"
            message="Belum ada data follow-up email."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Follow-Up Trend</CardTitle>
        <CardDescription>
          Trend email follow-up berdasarkan status (6 bulan terakhir)
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <ChartContainer config={chartConfig} className="h-[220px] w-full">
          <AreaChart data={chartData} margin={{ left: 0, right: 0, top: 8 }}>
            <defs>
              <linearGradient id="fillSent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fillScheduled" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fillDraft" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.04} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />

            <Area
              type="monotone"
              dataKey="draft"
              stroke="#f59e0b"
              fill="url(#fillDraft)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="scheduled"
              stroke="#3b82f6"
              fill="url(#fillScheduled)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="sent"
              stroke="#10b981"
              fill="url(#fillSent)"
              strokeWidth={2.5}
            />
          </AreaChart>
        </ChartContainer>

        <div className="grid gap-3 sm:grid-cols-3">
          {totals.map((item) => {
            const Icon = chartConfig[item.status].icon;

            return (
              <Card
                key={item.status}
                size="sm"
                className="gap-2 bg-muted/30 py-3"
              >
                <CardHeader className="flex items-center gap-2 justify-between">
                  <CardTitle className="text-xs text-muted-foreground">
                    {chartConfig[item.status].label}
                  </CardTitle>
                  <Icon
                    className="size-4"
                    style={{ color: chartConfig[item.status].color }}
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
