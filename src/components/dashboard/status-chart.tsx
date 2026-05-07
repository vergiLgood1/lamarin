"use client";

import { Pie, PieChart, Cell } from "recharts";
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

const STATUS_COLORS: Record<string, string> = {
  applied: "#3b82f6",
  reviewed: "#8b5cf6",
  interview: "#f59e0b",
  test: "#06b6d4",
  offered: "#10b981",
  accepted: "#22c55e",
  rejected: "#ef4444",
  withdrawn: "#6b7280",
};

const STATUS_LABELS: Record<string, string> = {
  applied: "Melamar",
  reviewed: "Direview",
  interview: "Interview",
  test: "Tes",
  offered: "Offering",
  accepted: "Diterima",
  rejected: "Ditolak",
  withdrawn: "Dibatalkan",
};

interface StatusChartProps {
  data: { status: string; count: number }[];
}

export function StatusChart({ data }: StatusChartProps) {
  const chartData = data.map((item) => ({
    name: STATUS_LABELS[item.status] || item.status,
    value: item.count,
    fill: STATUS_COLORS[item.status] || "#6b7280",
  }));

  const chartConfig = Object.fromEntries(
    data.map((item) => [
      item.status,
      {
        label: STATUS_LABELS[item.status] || item.status,
        color: STATUS_COLORS[item.status] || "#6b7280",
      },
    ])
  );

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Status Lamaran</CardTitle>
          <CardDescription>Breakdown berdasarkan status</CardDescription>
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
        <CardTitle>Status Lamaran</CardTitle>
        <CardDescription>Breakdown berdasarkan status</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto h-[200px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="mt-4 flex flex-wrap gap-2">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5 text-xs">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.fill }}
              />
              <span>
                {item.name} ({item.value})
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
