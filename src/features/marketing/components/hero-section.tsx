import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { cn } from "@/lib/utils";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center pt-24 text-center sm:pt-28">
      <div
        data-hero-reveal
        className={cn(
          "group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm shadow-2xl shadow-black/20 backdrop-blur-xl transition-all hover:border-white/20"
        )}
      >
        <AnimatedShinyText className="inline-flex items-center justify-center space-x-2">
          <Sparkles className="size-4 text-primary " />
          <span>Track applications and follow up on time</span>
        </AnimatedShinyText>
      </div>

      <h1
        data-hero-reveal
        className="mt-8 max-w-6xl text-balance text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl"
      >
        Track every job application and follow up at the right time.
      </h1>

      <p
        data-hero-reveal
        className="mt-6 max-w-2xl text-pretty text-base leading-8 text-muted-foreground sm:text-lg"
      >
        Lamarin helps job seekers record applications, generate follow-up
        drafts, schedule emails, and get reminders through calendar and
        messaging channels.
      </p>

      <div
        data-hero-reveal
        className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
      >
        <Link
          href="/register"
          className="group inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-2xl shadow-white/10 transition hover:scale-[1.02]"
        >
          Get Started for free
          <ArrowRight className="size-4 transition group-hover:translate-x-1" />
        </Link>

        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold backdrop-blur-xl transition hover:bg-white/[0.08]"
        >
          Open workspace
        </Link>
      </div>
    </div>
  );
}
