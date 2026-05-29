"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { workflowCards } from "../constants/landing-data";

export function WorkflowSection() {
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const beamRef = useRef<HTMLDivElement | null>(null);
  const stepOneRef = useRef<HTMLDivElement | null>(null);
  const stepTwoRef = useRef<HTMLDivElement | null>(null);
  const stepThreeRef = useRef<HTMLDivElement | null>(null);
  const stepRefs = [stepOneRef, stepTwoRef, stepThreeRef];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (!timelineRef.current || !beamRef.current || !stepOneRef.current || !stepThreeRef.current) {
        return;
      }

      const setBeamBounds = () => {
        if (!timelineRef.current || !beamRef.current || !stepOneRef.current || !stepThreeRef.current) {
          return;
        }

        const timelineRect = timelineRef.current.getBoundingClientRect();
        const firstRect = stepOneRef.current.getBoundingClientRect();
        const lastRect = stepThreeRef.current.getBoundingClientRect();
        const firstCenter = firstRect.top - timelineRect.top + firstRect.height / 2;
        const lastCenter = lastRect.top - timelineRect.top + lastRect.height / 2;

        gsap.set(beamRef.current, {
          top: firstCenter,
          height: Math.max(lastCenter - firstCenter, 0),
        });
      };

      setBeamBounds();

      gsap.fromTo(
        beamRef.current,
        { scaleY: 0, opacity: 0 },
        {
          scaleY: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 72%",
            end: "bottom 42%",
            scrub: 1.2,
            invalidateOnRefresh: true,
            onRefresh: setBeamBounds,
          },
        },
      );

      window.addEventListener("resize", setBeamBounds);

      return () => {
        window.removeEventListener("resize", setBeamBounds);
      };
    }, timelineRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div data-reveal className="mx-auto max-w-3xl text-center">
        <AnimatedShinyText className="text-sm font-medium uppercase tracking-[0.28em] text-primary">
          Workflow
        </AnimatedShinyText>
        <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          From application record to scheduled follow-up, every step stays clear.
        </h2>
      </div>

      <div ref={timelineRef} className="relative mt-16">
        <div className="pointer-events-none absolute left-6 top-0 z-0 hidden h-full w-px bg-gradient-to-b from-transparent via-white/20 to-transparent lg:left-1/2 lg:block" />
        <div
          ref={beamRef}
          className="pointer-events-none absolute left-1/2 z-0 hidden w-px origin-top bg-gradient-to-b from-cyan-400 via-primary to-violet-500 shadow-[0_0_18px_rgba(99,102,241,0.55)] lg:block"
        />

        <div className="relative z-10 space-y-20 lg:space-y-28">
          {workflowCards.map((item, index) => {
            const isReversed = index % 2 === 1;
            const detail = [
              "Start with the facts: company, role, source, status, contact, documents, and notes.",
              "Use saved context to create a focused follow-up draft before you send anything.",
              "Send manually, schedule the email, or keep reminders visible in calendar and messaging channels.",
            ][index];

            return (
              <div
                key={item.step}
                data-reveal
                className="relative grid items-center gap-6 lg:grid-cols-[1fr_auto_1fr]"
              >
                <article
                  className={`rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl ${
                    isReversed ? "lg:col-start-3" : "lg:col-start-1"
                  }`}
                >
                  <div className="mb-6 inline-flex rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-muted-foreground">
                    Step {item.step}
                  </div>
                  <h3 className="text-2xl font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-4 leading-7 text-muted-foreground">
                    {item.description}
                  </p>
                </article>

                <div
                  ref={stepRefs[index]}
                  className="relative z-20 hidden size-14 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-background text-sm font-semibold text-primary shadow-2xl shadow-primary/10 lg:col-start-2 lg:row-start-1 lg:flex"
                >
                  <span className="relative z-10">{item.step}</span>
                </div>

                <div
                  className={`hidden rounded-[2rem] border border-dashed border-white/10 p-6 text-sm leading-7 text-muted-foreground lg:row-start-1 lg:block ${
                    isReversed ? "lg:col-start-1" : "lg:col-start-3"
                  }`}
                >
                  {detail}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
