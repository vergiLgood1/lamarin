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

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {integrationCards.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              data-reveal
              className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 text-center backdrop-blur-xl"
            >
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
    </>
  );
}
