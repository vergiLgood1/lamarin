import { featureCards } from "../constants/landing-data";

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

      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {featureCards.map((feature) => {
          const Icon = feature.icon;

          return (
            <article
              key={feature.title}
              data-reveal
              className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/10 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[0.055]"
            >
              <div className="mb-6 flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]">
                <Icon className="size-5 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold tracking-tight">
                {feature.title}
              </h3>
              <p className="mt-4 leading-7 text-muted-foreground">
                {feature.description}
              </p>
            </article>
          );
        })}
      </div>
    </>
  );
}
