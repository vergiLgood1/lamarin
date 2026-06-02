import { BrandGuidelinesPage } from "@/features/marketing/components/brand-guidelines-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lamarin Brand Guidelines",
  description:
    "Brand guideline Lamarin untuk identitas merek, logo, warna, dan tipografi.",
};

export default function BrandPage() {
  return <BrandGuidelinesPage />;
}
