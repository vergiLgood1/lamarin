import { MarketingLandingPage } from "@/features/marketing/components/marketing-landing-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lamarin - Rapikan Orbit Lamaran Kerja",
  description:
    "Landing page Lamarin, ruang kerja untuk mencatat lamaran, menyiapkan follow-up, dan menjaga jadwal penting tetap terlihat.",
};

export default function MarketingPage() {
  return <MarketingLandingPage />;
}
