import { integrationCards } from "../constants/landing-data";

export function IntegrationsSection() {
  return (
    <>
      <div data-reveal className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary">
          Integrations
        </p>
        <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Connect with the tools you already use.
        </h2>
      </div>

      <div className="relative mx-auto mt-16 max-w-5xl">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.18),transparent_58%)]" />

        <div data-reveal className="mx-auto flex max-w-sm flex-col items-center rounded-[2rem] border border-white/10 bg-background/60 p-8 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="mb-5 flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-primary">
            L
          </div>
          <h3 className="text-2xl font-semibold tracking-tight">Lamarin workspace</h3>
          <p className="mt-3 leading-7 text-muted-foreground">
            Your application data stays in one place while connected tools handle
            schedules, reminders, and draft assistance.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {integrationCards.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                data-reveal
                className="relative rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 text-center backdrop-blur-xl"
              >
                <div className="pointer-events-none absolute inset-x-10 -top-8 hidden h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent md:block" />
                <div className="mx-auto mb-6 flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]">
                  <Icon className="size-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-4 leading-7 text-muted-foreground">
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
