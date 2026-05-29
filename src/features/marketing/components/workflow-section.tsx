import { workflowCards } from "../constants/landing-data";

export function WorkflowSection() {
  return (
    <>
      <div data-reveal className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary">
          Workflow
        </p>
        <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          From apply to follow-up, the process is easier to follow.
        </h2>
      </div>

      <div className="relative mt-16">
        <div className="pointer-events-none absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-white/20 to-transparent lg:left-1/2 lg:block" />

        <div className="space-y-8">
          {workflowCards.map((item, index) => (
            <div
              key={item.step}
              data-reveal
              className={`relative grid items-center gap-6 lg:grid-cols-[1fr_auto_1fr] ${
                index % 2 === 1 ? "lg:[&>article]:col-start-3" : ""
              }`}
            >
              <article className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl">
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

              <div className="hidden size-14 items-center justify-center rounded-full border border-white/10 bg-background text-sm font-semibold text-primary shadow-2xl shadow-primary/10 lg:flex">
                {item.step}
              </div>

              <div className="hidden rounded-[2rem] border border-dashed border-white/10 p-6 text-sm leading-7 text-muted-foreground lg:block">
                {index === 0 && "Start with the facts: company, role, source, documents, status, and notes."}
                {index === 1 && "Use the pipeline view to decide what needs review, scheduling, or follow-up."}
                {index === 2 && "Turn saved context into a focused draft, then edit it before sending."}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
