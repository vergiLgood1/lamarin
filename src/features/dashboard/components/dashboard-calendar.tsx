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
import { useMemo, useState } from "react";

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

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function toDateKey(date: Date) {
  return date.toISOString().split("T")[0];
}

function getDayItems() {
  const today = new Date();

  return [
    {
      key: "past",
      title: "Past",
      date: addDays(today, -1),
      label: "Kemarin",
    },
    {
      key: "today",
      title: "Today",
      date: today,
      label: "Hari ini",
    },
    {
      key: "future",
      title: "Future",
      date: addDays(today, 1),
      label: "Besok",
    },
  ] as const;
}

interface DashboardCalendarProps {
  schedules?: JobApplication[];
}

export default function DashboardCalendar({ schedules = [] }: DashboardCalendarProps) {
  const [activeIndex, setActiveIndex] = useState(1);

  const items = useMemo(() => getDayItems(), []);
  const scheduleDateKeys = useMemo(
    () => new Set(schedules.map((schedule) => schedule.followUpDate).filter(Boolean)),
    [schedules]
  );

  function goToPrevious() {
    setActiveIndex((current) => (current === 0 ? items.length - 1 : current - 1));
  }

  function goToNext() {
    setActiveIndex((current) => (current === items.length - 1 ? 0 : current + 1));
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <CalendarClock className="size-5 text-muted-foreground" />
            Date Stack
          </CardTitle>
          <CardDescription>Lihat tanggal past, today, dan future.</CardDescription>
        </div>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={goToPrevious}
            aria-label="Previous date card"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={goToNext}
            aria-label="Next date card"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="relative h-52">
          {items.map((item, index) => {
            const offset = index - activeIndex;
            const isActive = index === activeIndex;
            const hasSchedule = scheduleDateKeys.has(toDateKey(item.date));

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "absolute inset-0 w-full rounded-2xl border bg-card p-5 text-left shadow-sm transition-all duration-300",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  hasSchedule && "border-primary/50 bg-primary/5 ring-1 ring-primary/20",
                  isActive ? "z-20 opacity-100" : "z-10 opacity-70 hover:opacity-90",
                  offset === -1 && "-translate-x-3 translate-y-4 scale-[0.94] rotate-[-2deg]",
                  offset === 0 && "translate-x-0 translate-y-0 scale-100 rotate-0",
                  offset === 1 && "translate-x-3 translate-y-4 scale-[0.94] rotate-[2deg]",
                  Math.abs(offset) > 1 && "pointer-events-none opacity-0"
                )}
                aria-pressed={isActive}
              >
                <div className="flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {item.title}
                      </p>
                      <p className="mt-1 text-lg font-semibold leading-tight">
                        {DATE_FORMATTER.format(item.date)}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "flex size-16 shrink-0 flex-col items-center justify-center rounded-2xl",
                        hasSchedule
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <span className="text-xl font-bold tabular-nums">
                        {DAY_FORMATTER.format(item.date)}
                      </span>
                      <span className="text-xs uppercase tracking-wide">
                        {MONTH_FORMATTER.format(item.date)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    {hasSchedule && (
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                        Ada schedule
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-2">
          {items.map((item, index) => {
            const hasSchedule = scheduleDateKeys.has(toDateKey(item.date));

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  index === activeIndex ? "w-8" : "w-2",
                  hasSchedule ? "bg-primary" : "bg-muted-foreground/30"
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
