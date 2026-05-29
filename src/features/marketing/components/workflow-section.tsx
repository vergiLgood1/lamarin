import { workflowCards } from "../constants/landing-data";

export function WorkflowSection() {
  return (
    <section id="workflow" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div data-reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary">
            Workflow
          </p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            From apply to follow-up, the process is easier to follow.
          </h2>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {workflowCards.map((item) => (
            <article
              key={item.step}
              data-reveal
              className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl"
            >
              <div className="mb-8 inline-flex rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-muted-foreground">
                Step {item.step}
              </div>
              <h3 className="text-2xl font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="mt-4 leading-7 text-muted-foreground">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
