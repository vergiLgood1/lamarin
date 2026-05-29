"use client";

import {
  Database,
  FileArchive,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileType,
  StickyNote,
} from "lucide-react";
import React, { forwardRef, useRef } from "react";

import { AnimatedBeam } from "@/components/ui/animated-beam";
import { cn } from "@/lib/utils";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode; label?: string }
>(({ className, children, label }, ref) => {
  return (
    <div className="relative z-10 flex flex-col items-center gap-2">
      <div
        ref={ref}
        className={cn(
          "flex size-12 items-center justify-center rounded-full border border-white/10 bg-background/85 p-3 text-primary shadow-[0_0_24px_-14px_hsl(var(--primary))] backdrop-blur-xl transition duration-300 hover:scale-105 hover:border-primary/30 hover:bg-primary/10",
          className,
        )}
      >
        {children}
      </div>
      {label ? (
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </span>
      ) : null}
    </div>
  );
});

Circle.displayName = "Circle";

export function AnimatedBeamDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<HTMLDivElement>(null);
  const txtRef = useRef<HTMLDivElement>(null);
  const noteRef = useRef<HTMLDivElement>(null);
  const storageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const archiveRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="relative flex w-full items-center justify-center overflow-hidden p-10"
      ref={containerRef}
    >
      {/* <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" /> */}

      <div className="flex size-full  max-w-6xl flex-col items-stretch justify-between gap-10">
        <div className="flex flex-row items-center justify-between">
          <Circle ref={pdfRef} label="PDF">
            <FileText className="size-6" />
          </Circle>
          <Circle ref={imageRef} label="PNG">
            <FileImage className="size-6" />
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={txtRef} label="TXT">
            <FileType className="size-6" />
          </Circle>
          <Circle
            ref={storageRef}
            label="Storage"
            className="size-16 border-primary/30 bg-background text-primary shadow-[0_0_44px_-18px_hsl(var(--primary))]"
          >
            <Database className="size-8" />
          </Circle>
          <Circle ref={sheetRef} label="CSV">
            <FileSpreadsheet className="size-6" />
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={noteRef} label="Notes">
            <StickyNote className="size-6" />
          </Circle>
          <Circle ref={archiveRef} label="ZIP">
            <FileArchive className="size-6" />
          </Circle>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={pdfRef}
        toRef={storageRef}
        curvature={-75}
        endYOffset={-10}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={txtRef}
        toRef={storageRef}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={noteRef}
        toRef={storageRef}
        curvature={75}
        endYOffset={10}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={imageRef}
        toRef={storageRef}
        curvature={-75}
        endYOffset={-10}
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={sheetRef}
        toRef={storageRef}
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={archiveRef}
        toRef={storageRef}
        curvature={75}
        endYOffset={10}
        reverse
      />
    </div>
  );
}
