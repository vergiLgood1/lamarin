import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { faqs } from "../constants/landing-data";

export function FAQSection() {
  return (
    <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
      <div data-reveal className="lg:sticky lg:top-32">
        <AnimatedShinyText className="text-sm font-medium uppercase tracking-[0.28em] text-primary">
          FAQ
        </AnimatedShinyText>
        <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Honest answers, no overpromising.
        </h2>
        <p className="mt-5 leading-8 text-muted-foreground">
          Lamarin is designed as a tracking and preparation workspace, not an
          automated hiring agent. These answers clarify what the product does and
          does not do.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={faq.question}
            data-reveal
            className="group rounded-2xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl transition hover:bg-white/[0.055]"
          >
            <div className="flex items-start gap-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-sm text-primary">
                {index + 1}
              </span>
              <div>
                <h3 className="font-semibold">{faq.question}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
