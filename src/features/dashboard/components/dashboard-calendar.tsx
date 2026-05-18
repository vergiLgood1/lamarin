"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { JobApplication } from "@/types";
import { CalendarClock, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const DATE_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const DAY_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
});

const MONTH_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  month: "short",
});

const WEEKDAY_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  weekday: "short",
});

function toDateKey(date: Date) {
  return date.toISOString().split("T")[0];
}

function getDayItems() {
  const today = new Date();

  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const dayCount = endOfMonth.getDate() - today.getDate() + 1;

  return Array.from({ length: dayCount }, (_, index) => {
    const date = new Date(today);

    date.setDate(today.getDate() + index);

    return {
      key: toDateKey(date),
      title: index === 0 ? "Today" : WEEKDAY_FORMATTER.format(date),
      date,
      label: index === 0 ? "Hari ini" : DATE_FORMATTER.format(date),
    };
  });
}

interface DashboardCalendarProps {
  schedules?: JobApplication[];
}

export default function DashboardCalendar({
  schedules = [],
}: DashboardCalendarProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const items = useMemo(() => getDayItems(), []);

  const groupedSchedules = useMemo(() => {
    return schedules.reduce<Record<string, number>>((acc, schedule) => {
      if (!schedule.followUpDate) return acc;

      acc[schedule.followUpDate] = (acc[schedule.followUpDate] || 0) + 1;

      return acc;
    }, {});
  }, [schedules]);

  function goToPrevious() {
    setActiveIndex((current) => Math.max(current - 1, 0));
  }

  function goToNext() {
    setActiveIndex((current) => Math.min(current + 1, items.length - 1));
  }

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const activeCard = scrollContainer?.children.item(activeIndex);

    if (!(activeCard instanceof HTMLElement)) return;

    activeCard.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeIndex]);

  return (
    <Card className="overflow-hidden border-border/60">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarClock className="size-5 text-muted-foreground" />
            Calendar Bulan Ini
          </CardTitle>

          <CardDescription>
            Jadwal follow up dari hari ini sampai akhir bulan.
          </CardDescription>
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={goToPrevious}
            aria-label="Previous date card"
            disabled={activeIndex === 0}
          >
            <ChevronLeft className="size-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={goToNext}
            aria-label="Next date card"
            disabled={activeIndex === items.length - 1}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div
          ref={scrollContainerRef}
          className="flex snap-x snap-proximity gap-3 overflow-x-auto scroll-smooth px-1 pb-3 [overscroll-behavior-inline:contain] [scroll-padding-inline:1rem] [touch-action:pan-x]"
        >
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            const isToday = index === 0;

            const scheduleCount = groupedSchedules[toDateKey(item.date)] || 0;

            const hasSchedule = scheduleCount > 0;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "min-w-[220px] snap-center rounded-2xl border bg-card p-5 text-left transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  isToday && !isActive && "border-[var(--chart-1)] bg-[var(--chart-1)]/10",
                  hasSchedule && "border-primary/40 bg-primary/[0.03]",
                  isActive && hasSchedule &&
                    "border-primary bg-primary/[0.08] shadow-md ring-2 ring-primary/25",
                  isActive && !hasSchedule &&
                    "border-[var(--chart-1)] bg-[var(--chart-1)]/12 shadow-md ring-2 ring-[var(--chart-1)]/25",
                  !isActive && "hover:bg-muted/40 hover:shadow-sm",
                )}
                aria-pressed={isActive}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                        {item.title}
                      </p>

                      <h3 className="text-4xl font-bold leading-none tabular-nums">
                        {DAY_FORMATTER.format(item.date)}
                      </h3>

                      <p className="text-sm text-muted-foreground">
                        {MONTH_FORMATTER.format(item.date)}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">
                        {item.label}
                      </p>

                      {hasSchedule ? (
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                          {scheduleCount} schedule
                        </span>
                      ) : isToday ? (
                        <span className="inline-flex items-center rounded-full bg-[var(--chart-1)]/15 px-2.5 py-1 text-xs font-medium text-foreground">
                          Today
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                          Kosong
                        </span>
                      )}
                    </div>
                  </div>

                  <div
                    className={cn(
                      "mt-1 size-3 shrink-0 rounded-full",
                      hasSchedule
                        ? "bg-primary shadow-[0_0_12px_hsl(var(--primary))]"
                        : isToday
                          ? "bg-[var(--chart-1)] shadow-[0_0_12px_var(--chart-1)]"
                        : "bg-muted-foreground/20",
                    )}
                  />
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-1.5 overflow-x-auto pb-1">
          {items.map((item, index) => {
            const isToday = index === 0;
            const scheduleCount = groupedSchedules[toDateKey(item.date)] || 0;

            const hasSchedule = scheduleCount > 0;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "h-2 shrink-0 rounded-full transition-all duration-200",
                  index === activeIndex ? "w-8" : "w-2",
                  hasSchedule
                    ? "bg-primary"
                    : isToday
                      ? "bg-[var(--chart-1)]"
                    : "bg-muted-foreground/30",
                )}
                aria-label={`Show ${item.title} date`}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
