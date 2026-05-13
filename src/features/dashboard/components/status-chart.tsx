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
import { Cell, Label, Pie, PieChart, Sector } from "recharts";

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

interface ActiveShapeProps {
  cx?: number;
  cy?: number;
  innerRadius?: number;
  outerRadius?: number;
  startAngle?: number;
  endAngle?: number;
  fill?: string;
}

function ActiveSliceShape(props: ActiveShapeProps) {
  const {
    cx = 0,
    cy = 0,
    innerRadius = 0,
    outerRadius = 0,
    startAngle = 0,
    endAngle = 0,
    fill = "#6b7280",
  } = props;

  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 12}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
    />
  );
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
    ]),
  );

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Status Lamaran</CardTitle>
          <CardDescription>Breakdown berdasarkan status</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <DashboardEmptyState message="Belum ada data status lamaran." />
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
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="mx-auto h-[220px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={86}
              paddingAngle={0}
              activeShape={ActiveSliceShape}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {total}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Applications
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
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
