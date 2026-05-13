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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface TopSourcesCardProps {
  data: { source: string; count: number }[];
}

const chartConfig = {
  count: {
    label: "Lamaran",
    color: "#8fd3f4",
  },
};

export function TopSourcesCard({ data }: TopSourcesCardProps) {
  const chartData = data.slice(0, 5).map((item) => ({
    source: item.source.length > 10 ? `${item.source.slice(0, 10)}...` : item.source,
    count: item.count,
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Top Sumber Lowongan</CardTitle>
        <CardDescription>
          5 sumber lowongan dengan jumlah apply tertinggi.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {chartData.length === 0 ? (
          <DashboardEmptyState message="Belum ada data sumber lowongan." />
        ) : (
          <ChartContainer config={chartConfig} className="h-47.5 w-full ">
            <BarChart data={chartData} margin={{ left: 8, right: 8, top: 8 }}>
              <CartesianGrid vertical={false} />
              <YAxis hide type="number" tickLine={false} axisLine={false} />
              <XAxis
                dataKey="source"
                type="category"
                tickLine={false}
                axisLine={false}
                interval={0}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="count"
                fill="var(--color-count)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
