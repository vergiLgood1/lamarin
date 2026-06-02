import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

interface LamarinLogoProps extends SVGProps<SVGSVGElement> {
  markClassName?: string;
}

export function LamarinLogo({
  className,
  markClassName,
  ...props
}: LamarinLogoProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label="Lamarin logo"
      className={cn("size-9", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x="3"
        y="3"
        width="58"
        height="58"
        rx="18"
        className="fill-background stroke-white/12"
        strokeWidth="1.5"
      />
      <path
        d="M22 14V43C22 46.3137 24.6863 49 28 49H47"
        className={cn("stroke-current", markClassName)}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
      />
      <path
        d="M47 49C39 50.5 30.5 48.5 24 43.5C17.5 38.5 13.5 31 13 23.5"
        className="stroke-primary/45"
        strokeLinecap="round"
        strokeWidth="2.5"
      />
      <circle cx="47" cy="49" r="3" className="fill-primary" />
    </svg>
  );
}
