import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
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
  );
}
