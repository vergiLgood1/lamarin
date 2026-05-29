"use client";

import React, { forwardRef, useRef } from "react";
import {
  Database,
  FileArchive,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileType,
  StickyNote,
} from "lucide-react";

import { AnimatedBeam } from "@/components/ui/animated-beam";
import { cn } from "@/lib/utils";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border border-white/10 bg-background/85 p-3 text-primary shadow-[0_0_24px_-14px_hsl(var(--primary))] backdrop-blur-xl",
        className,
      )}
    >
      {children}
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
      className="relative flex h-[300px] w-full items-center justify-center overflow-hidden p-10"
      ref={containerRef}
    >
      <div className="flex size-full max-h-[200px] max-w-lg flex-col items-stretch justify-between gap-10">
        <div className="flex flex-row items-center justify-between">
          <Circle ref={pdfRef}>
            <FileText className="size-6" />
          </Circle>
          <Circle ref={imageRef}>
            <FileImage className="size-6" />
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={txtRef}>
            <FileType className="size-6" />
          </Circle>
          <Circle
            ref={storageRef}
            className="size-16 border-primary/30 bg-background text-primary shadow-[0_0_44px_-18px_hsl(var(--primary))]"
          >
            <Database className="size-8" />
          </Circle>
          <Circle ref={sheetRef}>
            <FileSpreadsheet className="size-6" />
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={noteRef}>
            <StickyNote className="size-6" />
          </Circle>
          <Circle ref={archiveRef}>
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
