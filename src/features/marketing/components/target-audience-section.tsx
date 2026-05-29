import { BriefcaseBusiness, GraduationCap, Laptop } from "lucide-react";

const audienceCards = [
  {
    icon: GraduationCap,
    label: "Fresh graduates",
    description:
      "Track internships and entry-level roles while learning how each hiring stage moves.",
    detail: "Keep status, documents, interview dates, and notes attached to each opportunity.",
  },
  {
    icon: BriefcaseBusiness,
    label: "Career switchers",
    description:
      "Compare roles across industries without losing salary context or follow-up timing.",
    detail: "Save source links, recruiter contacts, documents, and reasons for each role.",
  },
  {
    icon: Laptop,
    label: "Freelancers",
    description:
      "Manage contract and project-based applications alongside full-time opportunities.",
    detail: "Organize remote roles, proposals, deadlines, client contacts, and next actions.",
  },
];

export function TargetAudienceSection() {
  return (
    <div className="relative">
      {/* <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-64 w-[80%] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" /> */}

      <div data-reveal className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary">
          Built for real job search workflows
        </p>
        <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Built for different job search rhythms.
        </h2>
        <p className="mt-5 text-pretty leading-8 text-muted-foreground">
          Whether you are applying for your first role, switching careers, or
          managing contract opportunities, Lamarin keeps applications,
          documents, schedules, and follow-ups connected.
        </p>
      </div>

      <div className="mt-14 grid gap-5 lg:grid-cols-3">
        {audienceCards.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.label}
              data-reveal
              className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 text-left shadow-2xl shadow-black/10 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[0.055]"
            >
              {/* <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-primary/10 blur-2xl transition group-hover:bg-primary/20" /> */}

              <div className="mb-8 flex items-center justify-between gap-4">
                <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]">
                  <Icon className="size-5 text-primary" />
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-muted-foreground">
                  Persona
                </span>
              </div>

              <h3 className="text-2xl font-semibold tracking-tight">
                {item.label}
              </h3>
              <p className="mt-4 leading-7 text-muted-foreground">
                {item.description}
              </p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-background/40 p-4 text-sm leading-6 text-muted-foreground">
                {item.detail}
              </div>
            </article>
          );
        })}
      </div>

      <div
        data-reveal
        className="mt-5 grid gap-5 rounded-[2rem] border border-white/10 bg-white/[0.025] p-5 backdrop-blur-xl md:grid-cols-3"
      >
        {[
          [
            "Status clarity",
            "See which applications are Applied, Reviewed, Interview, Test, Offered, or Rejected.",
          ],
          [
            "Context saved",
            "Keep notes, documents, contacts, and source links attached to each application.",
          ],
          [
            "Follow-up prepared",
            "Create draft follow-ups from application context, then review before sending.",
          ],
        ].map(([title, description]) => (
          <div
            key={title}
            className="rounded-2xl bg-white/[0.03] p-4 text-left"
          >
            <p className="font-medium">{title}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
