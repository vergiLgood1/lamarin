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

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trend Lamaran</CardTitle>
          <CardDescription>Jumlah lamaran per bulan (6 bulan terakhir)</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[200px] items-center justify-center">
          <p className="text-sm text-muted-foreground">Belum ada data</p>
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
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
