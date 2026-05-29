import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useLandingAnimations() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Hero reveal animations
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

      // Orbit animations
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

      // Float animations
      gsap.to("[data-float]", {
        y: -12,
        duration: 2.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.18,
      });

      // Scroll reveal animations
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

      // Preview parallax animation
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

  return rootRef;
}
