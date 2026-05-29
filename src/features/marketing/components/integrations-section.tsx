"use client";

import { AnimatedBeam } from "@/components/ui/animated-beam";
import { cn } from "@/lib/utils";
import { Orbit } from "lucide-react";
import { forwardRef, useRef, type ReactNode } from "react";
import { integrationCards } from "../constants/landing-data";

interface CircleNodeProps {
  children: ReactNode;
  className?: string;
  label: string;
}

const CircleNode = forwardRef<HTMLDivElement, CircleNodeProps>(
  ({ children, className, label }, ref) => {
    return (
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div
          ref={ref}
          className={cn(
            "flex size-14 items-center justify-center rounded-full border border-white/15 bg-background/90 p-3 shadow-[0_0_24px_-12px_hsl(var(--primary))] backdrop-blur-xl",
            className,
          )}
        >
          {children}
        </div>
        <span className="max-w-28 text-center text-xs font-medium text-muted-foreground">
          {label}
        </span>
      </div>
    );
  },
);

CircleNode.displayName = "CircleNode";

export function IntegrationsSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const workspaceRef = useRef<HTMLDivElement | null>(null);
  const firstNodeRef = useRef<HTMLDivElement | null>(null);
  const secondNodeRef = useRef<HTMLDivElement | null>(null);
  const thirdNodeRef = useRef<HTMLDivElement | null>(null);
  const firstIntegration = integrationCards[0];
  const secondIntegration = integrationCards[1];
  const thirdIntegration = integrationCards[2];
  const FirstIcon = firstIntegration?.icon;
  const SecondIcon = secondIntegration?.icon;
  const ThirdIcon = thirdIntegration?.icon;

  return (
    <>
      <div data-reveal className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary">
          Integrations
        </p>

        <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Connect with the tools you already use.
        </h2>
        <p className="mt-5 text-pretty leading-8 text-muted-foreground">
          Keep Lamarin as the source of truth while connected tools support
          schedules, reminders, and draft preparation.
        </p>
      </div>

      <div
        data-reveal
        className="relative mx-auto mt-16 overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.025] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8"
      >
        <div
          ref={containerRef}
          className="relative mx-auto flex min-h-[22rem] w-full max-w-3xl items-center justify-center overflow-hidden px-4 py-10"
        >
          <div className="flex size-full flex-col items-stretch justify-between gap-10">
            <div className="flex items-center justify-end">
              {firstIntegration && FirstIcon && (
                <CircleNode ref={firstNodeRef} label={firstIntegration.title}>
                  <FirstIcon className="size-6 text-primary" />
                </CircleNode>
              )}
            </div>



            <div className="flex items-center justify-between gap-8">
              <CircleNode
                ref={workspaceRef}
                label="Lamarin workspace"
                className="size-20 border-primary/30 bg-background text-primary shadow-[0_0_48px_-18px_hsl(var(--primary))]"
              >
                <Orbit className="size-9" />
              </CircleNode>

              {secondIntegration && SecondIcon && (
                <CircleNode ref={secondNodeRef} label={secondIntegration.title}>
                  <SecondIcon className="size-6 text-primary" />
                </CircleNode>
              )}
            </div>

            <div className="flex items-center justify-end">
              {thirdIntegration && ThirdIcon && (
                <CircleNode ref={thirdNodeRef} label={thirdIntegration.title}>
                  <ThirdIcon className="size-6 text-primary" />
                </CircleNode>
              )}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 hidden md:block ">
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={workspaceRef}
              toRef={firstNodeRef}
              curvature={200}
              endYOffset={10}
              duration={3}
            />
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={workspaceRef}
              toRef={secondNodeRef}
              duration={3}
            />
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={workspaceRef}
              toRef={thirdNodeRef}
              curvature={-200}
              endYOffset={-10}
              duration={3}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {integrationCards.slice(0, 3).map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="rounded-[1.5rem] border border-white/10 bg-background/50 p-5 backdrop-blur-xl"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06]">
                    <Icon className="size-4 text-primary" />
                  </div>
                  <h3 className="font-semibold tracking-tight">{item.title}</h3>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </>
  );
}
