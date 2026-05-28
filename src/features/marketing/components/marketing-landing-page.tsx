"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  FileText,
  Mail,
  Orbit,
  Sparkles,
  Stars,
  TimerReset,
  Workflow
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#workflow" },
  { label: "Integrations", href: "#integrations" },
  { label: "FAQ", href: "#faq" },
];

const statusItems = [
  "Applied",
  "Reviewed",
  "Interview",
  "Test",
  "Offered",
  "Rejected",
];

const featureCards = [
  {
    icon: Workflow,
    title: "Application tracking",
    description:
      "Save company, position, status, application source, work mode, salary, HR contact, and notes.",
  },
  {
    icon: Mail,
    title: "Follow-up email",
    description:
      "Create follow-up drafts tied directly to the application context.",
  },
  {
    icon: CalendarDays,
    title: "Calendar schedule",
    description:
      "Track interviews, deadlines, and follow-ups so important dates stay visible.",
  },
  {
    icon: FileText,
    title: "Application documents",
    description:
      "Attach CVs, portfolios, cover letters, and other documents to the related application.",
  },
];

const workflowCards = [
  {
    step: "01",
    title: "Record application",
    description:
      "Enter position, company, job source, status, documents, and important notes.",
  },
  {
    step: "02",
    title: "Monitor status",
    description:
      "View application progress from Applied, Reviewed, Interview, Test, to Offered or Rejected.",
  },
  {
    step: "03",
    title: "Prepare follow-up",
    description:
      "Use application context to create professional email drafts that you can edit.",
  },
];

const integrationCards = [
  {
    icon: CalendarDays,
    title: "Google Calendar",
    description: "Create and manage events for follow-ups, interviews, or deadlines.",
  },
  {
    icon: Bell,
    title: "Telegram Reminder",
    description: "Send reminders one day before and on the day to your existing channel.",
  },
  {
    icon: Stars,
    title: "Gemini AI Draft",
    description: "AI helps write draft emails, not make recruitment decisions.",
  },
];

const faqs = [
  {
    question: "Does Lamarin apply for jobs automatically?",
    answer:
      "No. Lamarin helps record and manage the application process, not submit applications automatically.",
  },
  {
    question: "Does the AI decide whether I'll be hired?",
    answer:
      "No. AI only helps draft follow-up emails. You still review, edit, and decide.",
  },
  {
    question: "Can I export my application data?",
    answer:
      "Yes. Lamarin is designed so users can keep access to their own application data.",
  },
];

export function MarketingLandingPage() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.set("[data-hero-reveal]", {
        y: 28,
        opacity: 0,
        filter: "blur(10px)",
      });

      gsap.to("[data-hero-reveal]", {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
      });

      gsap.to("[data-orbit]", {
        rotate: 360,
        duration: 42,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      });

      gsap.to("[data-orbit-reverse]", {
        rotate: -360,
        duration: 56,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      });

      gsap.to("[data-float]", {
        y: -12,
        duration: 2.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.18,
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          {
            y: 42,
            opacity: 0,
            filter: "blur(10px)",
          },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 82%",
            },
          },
        );
      });

      gsap.to("[data-preview]", {
        yPercent: -5,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-preview-section]",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={rootRef}
      className="dark min-h-screen overflow-hidden bg-background text-foreground"
    >
      <section className="relative isolate min-h-screen px-4 py-5 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 -z-30 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_32%),radial-gradient(circle_at_50%_20%,hsl(var(--primary)/0.22),transparent_36%),linear-gradient(to_bottom,hsl(var(--background)),hsl(var(--background)))]" />
        <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20 [mask-image:radial-gradient(circle_at_top,black,transparent_70%)]" />

        <header
          data-hero-reveal
          className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-white/[0.035] px-4 py-3 shadow-2xl shadow-black/20 backdrop-blur-xl"
        >
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.06]">
              <Orbit className="size-4" />
            </span>
            <span className="text-sm font-semibold tracking-wide">Lamarin</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="transition hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground sm:inline-flex"
            >
              Log in
            </Link>

            <Link
              href="/register"
              className="inline-flex items-center rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:scale-[1.02]"
            >
              Sign up
            </Link>
          </div>
        </header>

        <div className="mx-auto flex max-w-6xl flex-col items-center pt-24 text-center sm:pt-28">
          <div
            data-hero-reveal
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-muted-foreground shadow-2xl shadow-black/20 backdrop-blur-xl"
          >
            <Sparkles className="size-4 text-primary" />
            A tidier job application workspace
          </div>

          <h1
            data-hero-reveal
            className="mt-8 max-w-5xl text-balance text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl"
          >
            One place to track applications, follow-ups, and important dates.
          </h1>

          <p
            data-hero-reveal
            className="mt-6 max-w-2xl text-pretty text-base leading-8 text-muted-foreground sm:text-lg"
          >
            Lamarin helps job seekers keep the application process visible:
            status, documents, follow-up emails, calendar schedule, and reminders
            in one workspace.
          </p>

          <div
            data-hero-reveal
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-2xl shadow-white/10 transition hover:scale-[1.02]"
            >
              Get Started for free
              <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold backdrop-blur-xl transition hover:bg-white/[0.08]"
            >
              Open workspace
            </Link>
          </div>
        </div>

        <div
          data-hero-reveal
          data-preview-section
          className="relative mx-auto mt-20 max-w-6xl"
        >
          <div className="pointer-events-none absolute left-1/2 top-12 -z-10 h-72 w-[80%] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />

          <div
            data-orbit
            className="pointer-events-none absolute -left-20 top-20 hidden size-64 rounded-full border border-dashed border-white/15 lg:block"
          />
          <div
            data-orbit-reverse
            className="pointer-events-none absolute -right-16 bottom-16 hidden size-52 rounded-full border border-dashed border-primary/25 lg:block"
          />

          <div
            data-preview
            className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-3 shadow-2xl shadow-black/40 backdrop-blur-xl"
          >
            <div className="rounded-[1.5rem] border border-white/10 bg-background/90">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-white/20" />
                  <span className="size-3 rounded-full bg-white/20" />
                  <span className="size-3 rounded-full bg-white/20" />
                </div>
                <p className="text-xs text-muted-foreground">
                  dashboard / overview
                </p>
              </div>

              <div className="grid gap-4 p-4 lg:grid-cols-[0.72fr_1.28fr]">
                <aside className="hidden rounded-2xl border border-white/10 bg-white/[0.035] p-4 lg:block">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-full bg-white/[0.06]">
                      <Orbit className="size-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium">Lamarin</p>
                      <p className="text-xs text-muted-foreground">
                        Job application workspace
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {[
                      "Overview",
                      "Applications",
                      "Send Email",
                      "Follow-ups",
                      "Settings",
                    ].map((item, index) => (
                      <div
                        key={item}
                        className={`rounded-xl px-3 py-2 text-sm ${index === 0
                            ? "bg-white/[0.08] text-foreground"
                            : "text-muted-foreground"
                          }`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </aside>

                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    {[
                      ["Total applications", "24"],
                      ["Need follow-up", "5"],
                      ["Upcoming events", "3"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"
                      >
                        <p className="text-sm text-muted-foreground">{label}</p>
                        <p className="mt-3 text-3xl font-semibold">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                      <div className="mb-5 flex items-center justify-between">
                        <div>
                          <p className="font-medium">Application activity</p>
                          <p className="text-sm text-muted-foreground">
                            Weekly application trend
                          </p>
                        </div>
                        <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-muted-foreground">
                          7 days
                        </span>
                      </div>

                      <div className="flex h-52 items-end gap-2">
                        {[42, 58, 35, 72, 52, 88, 66].map((height, index) => (
                          <div
                            key={index}
                            className="flex-1 rounded-t-xl bg-foreground/20"
                            style={{ height: `${height}%` }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                      <p className="font-medium">Status orbit</p>
                      <div className="mt-5 space-y-3">
                        {statusItems.map((status, index) => (
                          <div
                            key={status}
                            className="flex items-center justify-between rounded-xl bg-white/[0.04] px-3 py-2"
                          >
                            <span className="text-sm text-muted-foreground">
                              {status}
                            </span>
                            <span className="text-sm font-medium">
                              {index === 0
                                ? "8"
                                : index === 2
                                  ? "3"
                                  : index === 4
                                    ? "1"
                                    : "—"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            data-float
            className="absolute -left-4 top-24 hidden max-w-56 rounded-2xl border border-white/10 bg-background/80 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl lg:block"
          >
            <TimerReset className="mb-3 size-5 text-primary" />
            <p className="text-sm font-medium">Follow-up tomorrow</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Don&apos;t forget to send a follow-up for the Frontend Developer role.
            </p>
          </div>

          <div
            data-float
            className="absolute -right-4 bottom-20 hidden max-w-56 rounded-2xl border border-white/10 bg-background/80 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl lg:block"
          >
            <Mail className="mb-3 size-5 text-primary" />
            <p className="text-sm font-medium">Draft ready</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              You can review and edit the email before sending.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div data-reveal className="mx-auto max-w-6xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground">
            Built for real job search workflows
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {["Fresh graduates", "Career switchers", "Freelancers"].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 text-sm text-muted-foreground backdrop-blur-xl"
                >
                  {item}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <section id="features" className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div data-reveal className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary">
              Features
            </p>
            <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Semua bagian penting dari proses lamaran tetap terhubung.
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
        </div>
      </section>

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

      <section id="integrations" className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
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
        </div>
      </section>

      <section id="faq" className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div data-reveal className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary">
              FAQ
            </p>
            <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Honest answers, no overpromising.
            </h2>
          </div>

          <div className="mt-12 space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                data-reveal
                className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl"
              >
                <h3 className="font-semibold">{faq.question}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div
          data-reveal
          className="mx-auto max-w-5xl rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-12"
        >
          <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Stop tracking applications from scattered places.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-pretty leading-8 text-muted-foreground">
            Start saving applications, follow-ups, documents, and important dates in
            a calmer workspace.
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
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold transition hover:bg-white/[0.08]"
            >
              Log in
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.06]">
                <Orbit className="size-4" />
              </span>
              <span className="text-sm font-semibold tracking-wide">Lamarin</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">
              Job application tracker and follow-up workspace to keep the application
              process visible and organized.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold">Product</p>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <a href="#features" className="block hover:text-foreground">
                Features
              </a>
              <a href="#workflow" className="block hover:text-foreground">
                Workflow
              </a>
              <a href="#integrations" className="block hover:text-foreground">
                Integrations
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold">Workspace</p>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <Link href="/dashboard/overview" className="block hover:text-foreground">
                Dashboard
              </Link>
              <Link href="/dashboard/applications" className="block hover:text-foreground">
                Applications
              </Link>
              <Link href="/dashboard/send-email" className="block hover:text-foreground">
                Send Email
              </Link>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold">Account</p>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <Link href="/login" className="block hover:text-foreground">
                Log in
              </Link>
              <Link href="/register" className="block hover:text-foreground">
                Sign up
              </Link>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-6xl flex-col justify-between gap-3 border-t border-white/10 pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Lamarin. All rights reserved.</p>
          <p>Built for organized job search workflows.</p>
        </div>
      </footer>
    </main>
  );
}