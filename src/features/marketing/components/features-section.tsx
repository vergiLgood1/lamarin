"use client";

import { AnimatedList } from "@/components/ui/animated-list";
import { Marquee } from "@/components/ui/marquee";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { cn } from "@/lib/utils";
import {
  applicationStatuses,
  featureCards,
  followUpDrafts,
  reminders,
  type ReminderItem,
} from "../constants/landing-data";
import { AnimatedBeamDemo as FilesVisual } from "./files";

function ReminderNotification({
  name,
  description,
  icon,
  color,
  time,
}: ReminderItem) {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full cursor-pointer overflow-hidden rounded-2xl p-3",
        "transition-all duration-200 ease-in-out hover:scale-[1.02]",
        "border border-white/10 bg-background/60 shadow-[0_-20px_80px_-20px_rgba(255,255,255,0.12)_inset] backdrop-blur-md",
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: color }}
        >
          <span className="text-base">{icon}</span>
        </div>
        <div className="min-w-0 flex-1 overflow-hidden text-left">
          <figcaption className="flex items-center gap-1 whitespace-nowrap text-sm font-medium">
            <span className="truncate">{name}</span>
            <span className="text-muted-foreground">·</span>
            <span className="shrink-0 text-xs text-muted-foreground">{time}</span>
          </figcaption>
          <p className="truncate text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    </figure>
  );
}

const bentoLayouts = [
  "md:col-span-2 lg:col-span-7 ",
  "lg:col-span-5 lg:row-span-2",
  "lg:col-span-7",
  "md:col-span-2 lg:col-span-12",
];

const featureMeta = [
  {
    stat: "6 statuses",
    visual: (
      <div className="relative mt-8 overflow-hidden rounded-2xl border border-white/10 bg-background/50 py-4">
        <Marquee className="[--duration:18s] [--gap:0.75rem]" repeat={4}>
          {applicationStatuses.map((status) => (
            <div
              key={status}
              className={cn(
                "rounded-full border px-4 py-2 text-center text-xs font-medium shadow-[0_-12px_40px_-24px_rgba(255,255,255,0.35)_inset]",
                status === "Interview"
                  ? "border-primary/40 bg-primary/15 text-primary"
                  : "border-white/10 bg-white/[0.04] text-muted-foreground",
              )}
            >
              {status}
            </div>
          ))}
        </Marquee>

        <Marquee
          className="mt-3 [--duration:22s] [--gap:0.75rem]"
          repeat={4}
          reverse
        >
          {[...applicationStatuses].reverse().map((status) => (
            <div
              key={`reverse-${status}`}
              className={cn(
                "rounded-full border px-4 py-2 text-center text-xs font-medium shadow-[0_-12px_40px_-24px_rgba(255,255,255,0.35)_inset]",
                status === "Offered"
                  ? "border-primary/40 bg-primary/15 text-primary"
                  : "border-white/10 bg-white/[0.04] text-muted-foreground",
              )}
            >
              {status}
            </div>
          ))}
        </Marquee>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
      </div>
    ),
  },
  {
    stat: "Dates",
    visual: (
      <div className="mt-8 grid gap-4">
        <div className="relative flex h-[34rem] flex-col overflow-hidden p-1">
          <AnimatedList className="gap-2" delay={1000} loop maxItems={12}>
            {reminders.map((item, index) => (
              <ReminderNotification {...item} key={`${item.name}-${index}`} />
            ))}
          </AnimatedList>
        </div>
      </div>
    ),
  },
  {
    stat: "Drafts",
    visual: (
      <div className="relative mt-8 overflow-hidden rounded-2xl border border-white/10 bg-background/50 p-4 shadow-[0_-20px_80px_-20px_rgba(255,255,255,0.12)_inset]">
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <p className="text-sm font-medium text-foreground">AI draft generated</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Based on application context
            </p>
          </div>
          <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
            Review before send
          </span>
        </div>

        <TypingAnimation
          words={followUpDrafts}
          loop
          typeSpeed={24}
          deleteSpeed={12}
          pauseDelay={1800}
          startOnView
          cursorStyle="line"
          className="block min-h-36 whitespace-pre-wrap text-sm leading-7 tracking-normal text-muted-foreground"
        />
      </div>
    ),
  },
  {
    stat: "Files + notes",
    visual: (
      <div className="relative mt-8 overflow-hidden rounded-2xl border border-white/10 bg-background/50 shadow-[0_-20px_80px_-20px_rgba(255,255,255,0.12)_inset]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.14),transparent_58%)]" />
        <FilesVisual />
      </div>
    ),
  },
];

export function FeaturesSection() {
  return (
    <>
      <div data-reveal className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary">
          Features
        </p>
        <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          All key parts of the application process remain connected.
        </h2>
        <p className="mt-5 text-pretty leading-8 text-muted-foreground">
          Lamarin isn&apos;t just an applications table. Each application can have
          status, documents, follow-up emails, schedules, reminders, and notes.
        </p>
      </div>

      <div className="mt-14 grid auto-rows-[minmax(18rem,auto)] gap-5 md:grid-cols-2 lg:grid-cols-12">
        {featureCards.map((feature, index) => {
          const Icon = feature.icon;
          const meta = featureMeta[index];

          return (
            <article
              key={feature.title}
              data-reveal
              className={`group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/10 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[0.055] ${bentoLayouts[index]}`}
            >
              <div className="relative z-10 flex items-start justify-between gap-5">
                <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]">
                  <Icon className="size-5 text-primary" />
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-muted-foreground">
                  {meta?.stat}
                </span>
              </div>
              <h3 className="relative z-10 mt-6 text-2xl font-semibold tracking-tight">
                {feature.title}
              </h3>
              <p className="relative z-10 mt-4 max-w-2xl leading-7 text-muted-foreground">
                {feature.description}
              </p>
              <div className="relative z-10">{meta?.visual}</div>
            </article>
          );
        })}
      </div>
    </>
  );
}
