import { AnimatedList } from "@/components/ui/animated-list";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";
import { featureCards } from "../constants/landing-data";

interface ReminderItem {
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
}

const reminders: ReminderItem[] = Array.from(
  { length: 8 },
  () => [
    {
      name: "Interview reminder",
      description: "Frontend Developer at Acme",
      time: "Tomorrow",
      icon: "📅",
      color: "#1E86FF",
    },
    {
      name: "Send follow-up",
      description: "2 days after interview",
      time: "Fri",
      icon: "✉️",
      color: "#8B5CF6",
    },
    {
      name: "Take-home deadline",
      description: "Submit repository link",
      time: "5 PM",
      icon: "⏱️",
      color: "#F59E0B",
    },
    {
      name: "Recruiter check-in",
      description: "Ask for timeline update",
      time: "Mon",
      icon: "👤",
      color: "#00C9A7",
    },
  ],
).flat();

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
      <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {["Applied", "Reviewed", "Interview", "Test", "Offered", "Rejected"].map(
          (status, index) => (
            <div
              key={status}
              className={`rounded-full border px-3 py-2 text-center text-xs ${index === 2
                  ? "border-primary/40 bg-primary/15 text-primary"
                  : "border-white/10 bg-white/[0.04] text-muted-foreground"
                }`}
            >
              {status}
            </div>
          ),
        )}
      </div>
    ),
  },
  {
    stat: "Drafts",
    visual: (
      <div className="relative mt-8 overflow-hidden rounded-2xl border border-white/10 bg-background/50 py-3">
        <Marquee className="[--duration:22s] [--gap:0.75rem]" pauseOnHover repeat={3}>
          {[
            "Follow-up draft",
            "Recruiter reply",
            "Interview thank-you",
            "Availability note",
            "Next-step check-in",
          ].map((draft) => (
            <div
              key={draft}
              className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-medium text-muted-foreground shadow-[0_-12px_40px_-24px_rgba(255,255,255,0.35)_inset]"
            >
              {draft}
            </div>
          ))}
        </Marquee>

        <Marquee
          className="mt-2 [--duration:26s] [--gap:0.75rem]"
          pauseOnHover
          repeat={3}
          reverse
        >
          {[
            "frontend-acme.md",
            "thank-you-email.txt",
            "salary-context.md",
            "portfolio-links.md",
            "screening-notes.txt",
          ].map((file) => (
            <div
              key={file}
              className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs text-muted-foreground"
            >
              {file}
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
        <div className="relative flex h-48 flex-col overflow-hidden p-1">
          <AnimatedList className="gap-2" delay={1000} loop maxItems={4}>
            {reminders.map((item, index) => (
              <ReminderNotification {...item} key={`${item.name}-${index}`} />
            ))}
          </AnimatedList>
        </div>
      </div>
    ),
  },
  {
    stat: "Files + notes",
    visual: (
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {["CV.pdf", "Portfolio", "Cover letter"].map((file) => (
          <div
            key={file}
            className="rounded-2xl border border-white/10 bg-background/50 px-4 py-3 text-sm text-muted-foreground"
          >
            {file}
          </div>
        ))}
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
