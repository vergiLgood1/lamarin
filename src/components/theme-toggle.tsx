"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggleButton } from "@/components/ui/skiper-ui/skiper26";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { COLOR_SCHEMES } from "@/lib/constants";
import { Check, ChevronDown } from "lucide-react";

export function ThemeToggle() {
  const { scheme, setScheme } = useColorScheme();

  return (
    <div className="flex items-center gap-2">
      {/* Mode toggle (light/dark) with animated SVG button */}
      <ThemeToggleButton variant="circle" start="top-right" />

      {/* Color scheme picker */}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              size="lg"
              className="w-56 justify-between"
            >
              <span className="truncate text-left">
                Select a schema: <span className="ml-2">{scheme}</span>
              </span>
              <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-56">
          {COLOR_SCHEMES.map((cs) => (
            <DropdownMenuItem key={cs.id} onClick={() => setScheme(cs.id)}>
              <span
                className="mr-2 inline-block size-3 rounded-full shrink-0"
                style={{ backgroundColor: cs.color }}
              />
              <span className="flex-1">{cs.label}</span>
              {scheme === cs.id && (
                <Check className="ml-2 h-3.5 w-3.5 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
