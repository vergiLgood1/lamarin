"use client";

import Lenis from "lenis";
import { ReactNode, useEffect } from "react";

interface LenisProviderProps {
  children: ReactNode;
}

/**
 * Lenis smooth scrolling provider for marketing pages
 * Initializes smooth scrolling for the entire marketing section
 */
export function LenisProvider({ children }: LenisProviderProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    // Request animation frame loop
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
