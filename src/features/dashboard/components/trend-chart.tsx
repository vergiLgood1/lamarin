"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";
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

interface TrendChartProps {
  data: { month: string; count: number }[];
}

const chartConfig = {
  count: {
    label: "Lamaran",
    color: "hsl(var(--chart-1))",
  },
};

export function TrendChart({ data }: TrendChartProps) {
  const chartData = data.map((item) => ({
    month: item.month,
    count: item.count,
  }));

  const totalApplications = chartData.reduce((sum, item) => sum + item.count, 0);
  const averageApplications =
    chartData.length > 0 ? Math.round(totalApplications / chartData.length) : 0;
  const peakMonth =
    chartData.length > 0
      ? chartData.reduce((max, item) => (item.count > max.count ? item : max))
      : null;

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trend Lamaran</CardTitle>
          <CardDescription>Jumlah lamaran per bulan (6 bulan terakhir)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex h-[200px] items-center justify-center">
            <p className="text-sm text-muted-foreground">Belum ada data</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">Total 6 Bulan</p>
              <p className="text-lg font-semibold tabular-nums">0</p>
            </div>
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">Rata-rata / Bulan</p>
              <p className="text-lg font-semibold tabular-nums">0</p>
            </div>
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">Bulan Tertinggi</p>
              <p className="text-lg font-semibold">-</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trend Lamaran</CardTitle>
        <CardDescription>Jumlah lamaran per bulan (6 bulan terakhir)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart data={chartData}>
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="count"
              fill="var(--color-count)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">Total 6 Bulan</p>
            <p className="text-lg font-semibold tabular-nums">{totalApplications}</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">Rata-rata / Bulan</p>
            <p className="text-lg font-semibold tabular-nums">{averageApplications}</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">Bulan Tertinggi</p>
            <p className="text-lg font-semibold">
              {peakMonth ? `${peakMonth.month} (${peakMonth.count})` : "-"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
