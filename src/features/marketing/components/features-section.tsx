import { featureCards } from "../constants/landing-data";

const bentoLayouts = [
  "md:col-span-2 lg:col-span-7 lg:row-span-2",
  "lg:col-span-5",
  "lg:col-span-5",
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
              className={`rounded-full border px-3 py-2 text-center text-xs ${
                index === 2
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
      <div className="mt-8 rounded-2xl border border-white/10 bg-background/50 p-4 text-sm leading-6 text-muted-foreground">
        Hi recruiter, following up on the Frontend Developer application...
      </div>
    ),
  },
  {
    stat: "Dates",
    visual: (
      <div className="mt-8 grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
        {Array.from({ length: 14 }, (_, index) => (
          <div
            key={index}
            className={`rounded-lg py-2 ${
              index === 9 ? "bg-primary text-primary-foreground" : "bg-white/[0.04]"
            }`}
          >
            {index + 1}
          </div>
        ))}
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
              <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-primary/10 blur-3xl transition group-hover:bg-primary/20" />
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
