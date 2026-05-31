"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function useLandingAnimations() {
  const rootRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      const q = gsap.utils.selector(rootRef);

      /**
       * Respect reduced motion.
       * Kalau user aktifkan reduce motion di OS/browser,
       * animasi berat akan dimatikan.
       */
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(q("[data-hero-reveal]"), {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
        });

        return () => {};
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const heroRevealElements = q("[data-hero-reveal]");
        const orbitElements = q("[data-orbit]");
        const orbitReverseElements = q("[data-orbit-reverse]");
        const floatElements = q("[data-float]");
        const previewElements = q("[data-preview]");
        const previewSection = q("[data-preview-section]")[0];

        /**
         * Hero reveal
         */
        gsap.set(heroRevealElements, {
          y: 28,
          opacity: 0,
          filter: "blur(10px)",
          willChange: "transform, opacity, filter",
        });

        gsap.to(heroRevealElements, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "willChange",
        });

        /**
         * Orbit animations
         */
        if (orbitElements.length) {
          gsap.to(orbitElements, {
            rotate: 360,
            duration: 42,
            repeat: -1,
            ease: "none",
            transformOrigin: "50% 50%",
          });
        }

        if (orbitReverseElements.length) {
          gsap.to(orbitReverseElements, {
            rotate: -360,
            duration: 56,
            repeat: -1,
            ease: "none",
            transformOrigin: "50% 50%",
          });
        }

        /**
         * Floating elements
         */
        if (floatElements.length) {
          gsap.to(floatElements, {
            y: -12,
            duration: 2.6,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            stagger: 0.18,
          });
        }

        /**
         * Preview parallax
         */
        if (previewElements.length && previewSection) {
          gsap.to(previewElements, {
            yPercent: -5,
            ease: "none",
            scrollTrigger: {
              trigger: previewSection,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });
        }

        return () => {};
      });

      /**
       * Desktop only animation
       */
      mm.add("(min-width: 1024px)", () => {
        const header = q("[data-marketing-header]")[0];

        if (!header || !rootRef.current) return;

        gsap.to(header, {
          maxWidth: "72rem",
          ease: "power3.out",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "+=160",
            scrub: 0.7,
          },
        });

        return () => {};
      });

      return () => {
        mm.revert();
      };
    },
    {
      scope: rootRef,
    },
  );

  return rootRef;
}
