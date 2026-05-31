import { LenisProvider } from "@/features/marketing/components/lenis-provider";
import type { ReactNode } from "react";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <LenisProvider>
      {children}
    </LenisProvider>
  );
}

