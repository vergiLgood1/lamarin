import { faqs } from "../constants/landing-data";

export function FAQSection() {
  return (
    <>
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
    </>
  );
}
