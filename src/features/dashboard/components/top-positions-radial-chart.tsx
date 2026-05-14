"use client";

import {
  Card,
  CardAction,
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
import { CalendarClock } from "lucide-react";
import { Cell, Pie, PieChart } from "recharts";

interface TopPositionsRadialChartProps {
  data: { position: string; count: number }[];
}

const chartConfig = {
  first: { label: "Top 1", color: "#8fd3f4" },
  second: { label: "Top 2", color: "#f7dc6f" },
  third: { label: "Top 3", color: "#f4c9ba" },
};

export function TopPositionsRadialChart({ data }: TopPositionsRadialChartProps) {
  const chartData = data.slice(0, 3).map((item, index) => {
    if (index === 0) {
      return {
        ...item,
        key: "first" as const,
        fill: chartConfig.first.color,
        dotColor: chartConfig.first.color,
      };
    }
    if (index === 1) {
      return {
        ...item,
        key: "second" as const,
        fill: chartConfig.second.color,
        dotColor: chartConfig.second.color,
      };
    }
    return {
      ...item,
      key: "third" as const,
      fill: chartConfig.third.color,
      dotColor: chartConfig.third.color,
    };
  });

  const total = chartData.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 3 Posisi (Applied)</CardTitle>
        <CardDescription>
          Posisi yang paling sering ada di status applied.
        </CardDescription>
        <CardAction>
          <span className="text-muted-foreground">•••</span>
        </CardAction>
      </CardHeader>
      <CardContent className="flex-1">
        {chartData.length === 0 ? (
          <DashboardEmptyState message="Belum ada data posisi pada status applied." />
        ) : (
          <div className="grid gap-4 md:grid-cols-[220px_1fr] md:items-center">
            <div className="relative mx-auto h-47.5 w-55 md:min-h-51.5">
              <ChartContainer
                config={chartConfig}
                className="h-47.5 w-55 md:min-h-51.5"
              >
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={chartData}
                    dataKey="count"
                    nameKey="position"
                    innerRadius={62}
                    outerRadius={95}
                    paddingAngle={4}
                    cornerRadius={10}
                    strokeWidth={0}
                  >
                    {chartData.map((item) => (
                      <Cell key={item.position} fill={item.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>

              <div className="pointer-events-none absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-background">
                <CalendarClock className="size-6 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-3">
              {chartData.map((item) => {
                const percentage =
                  total > 0 ? Math.round((item.count / total) * 100) : 0;

                return (
                  <div
                    key={item.position}
                    className="flex items-center justify-between rounded-xl border px-3 py-2"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: item.dotColor }}
                      />
                      <span className="truncate text-sm font-medium tabular-nums">
                        {item.count}
                      </span>
                      <span className="truncate text-sm text-muted-foreground">
                        {item.position}
                      </span>
                    </div>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {percentage}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
