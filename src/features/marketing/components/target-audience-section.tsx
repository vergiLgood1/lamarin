import { targetAudiences } from "../constants/landing-data";

export function TargetAudienceSection() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div data-reveal className="mx-auto max-w-6xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground">
          Built for real job search workflows
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {targetAudiences.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 text-sm text-muted-foreground backdrop-blur-xl"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
