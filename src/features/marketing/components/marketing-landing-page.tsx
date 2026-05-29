"use client";

import { Particles } from "@/components/ui/particles";
import { useLandingAnimations } from "../hooks/use-landing-animations";
import { CTASection } from "./cta-section";
import { FAQSection } from "./faq-section";
import { FeaturesSection } from "./features-section";
import { Footer } from "./footer";
import { Header } from "./header";
import { HeroSection } from "./hero-section";
import { IntegrationsSection } from "./integrations-section";
import { PreviewDashboard } from "./preview-dashboard";
import { TargetAudienceSection } from "./target-audience-section";
import { WorkflowSection } from "./workflow-section";

export function MarketingLandingPage() {
  const rootRef = useLandingAnimations();

  return (
    <main
      ref={rootRef}
      className="dark min-h-screen overflow-hidden bg-background text-foreground"
    >
      <section className="relative isolate min-h-screen px-4 py-5 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 -z-30 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_32%),radial-gradient(circle_at_50%_20%,hsl(var(--primary)/0.22),transparent_36%),linear-gradient(to_bottom,hsl(var(--background)),hsl(var(--background)))]" />
        <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[64px_64px] opacity-20 mask-[radial-gradient(circle_at_top,black,transparent_70%)]" />

        <Particles
          className="absolute inset-0 -z-10"
          quantity={100}
          ease={80}
          color="#ffffff"
          refresh={false}
        />

        <Header />
        <HeroSection />
        <PreviewDashboard />
      </section>

      <TargetAudienceSection />
      <FeaturesSection />
      <WorkflowSection />
      <IntegrationsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
