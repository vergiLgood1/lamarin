import { LogoLoop, type LogoItem } from "@/components/logo-loop";
import {
  ArrowRight,
  BarChart3,
  Bell,
  CalendarDays,
  FileText,
  Globe,
  HeartHandshake,
  Mail,
  Shield,
} from "lucide-react";
import Link from "next/link";

const logoItems: LogoItem[] = [
  {
    node: <Globe className="size-full" />,
    title: "Application sources",
  },
  {
    node: <BarChart3 className="size-full" />,
    title: "Progress tracking",
  },
  {
    node: <HeartHandshake className="size-full" />,
    title: "Scheduled follow-ups",
  },
  {
    node: <Shield className="size-full" />,
    title: "Organized data",
  },
  {
    node: <FileText className="size-full" />,
    title: "Application documents",
  },
  {
    node: <Bell className="size-full" />,
    title: "Messaging reminders",
  },
  {
    node: <Mail className="size-full" />,
    title: "AI email drafts",
  },
  {
    node: <CalendarDays className="size-full" />,
    title: "Google Calendar",
  },
];

function renderLogoCard(item: LogoItem, key: React.Key) {
  return (
    <div
      key={key}
      className="relative size-20 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-foreground/70 shadow-[0_-20px_80px_-20px_rgba(255,255,255,0.12)_inset] backdrop-blur-xl"
      title={item.title}
    >
      <div className="relative z-10 size-full">{"node" in item ? item.node : item.alt}</div>
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-primary via-cyan-400 to-violet-500 opacity-60 blur-[20px]" />
    </div>
  );
}

export function CTASection() {
  return (
    <div
      data-reveal
      className="relative flex min-h-[34rem] overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/30 backdrop-blur-xl"
    >
      <div className="absolute inset-0 flex flex-col justify-center gap-2 py-14 opacity-70">
        <LogoLoop
          logos={logoItems}
          speed={54}
          logoHeight={80}
          gap={16}
          direction="right"
          ariaLabel="CTA background icons row one"
          renderItem={renderLogoCard}
        />
        <LogoLoop
          logos={[...logoItems].reverse()}
          speed={42}
          logoHeight={80}
          gap={16}
          direction="left"
          ariaLabel="CTA background icons row two"
          renderItem={renderLogoCard}
        />
        <LogoLoop
          logos={logoItems}
          speed={50}
          logoHeight={80}
          gap={16}
          direction="right"
          ariaLabel="CTA background icons row three"
          renderItem={renderLogoCard}
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-b from-transparent via-background/60 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--background)/0.22),hsl(var(--background)/0.88)_52%,hsl(var(--background))_78%)]" />

      <div className="relative z-10 m-auto flex max-w-3xl flex-col items-center px-8 py-16 text-center sm:px-12">
        <div className="mx-auto size-24 rounded-[2rem] border border-white/10 bg-background/20 p-3 shadow-2xl backdrop-blur-md lg:size-32">
          <HeartHandshake className="mx-auto size-16 text-foreground lg:size-24" />
        </div>

        <h2 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Stop missing follow-ups after you apply.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-pretty leading-8 text-muted-foreground">
          Keep applications, AI draft emails, scheduled sends, documents, and
          reminders in one calmer workspace.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/register"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:scale-[1.02]"
          >
            Get Started for free
            <ArrowRight className="size-4 transition group-hover:translate-x-1" />
          </Link>

          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold backdrop-blur-xl transition hover:bg-white/[0.08]"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
