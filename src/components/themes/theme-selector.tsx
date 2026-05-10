"use client";

import { useThemeConfig } from "@/components/themes/active-theme";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { CheckIcon } from "lucide-react";

import { IconChevronDown } from "@tabler/icons-react";
import { Icons } from "../icons";
import { Kbd } from "../ui/kbd";
import { THEMES } from "./theme.config";

export function ThemeSelector() {
  const { activeTheme, setActiveTheme } = useThemeConfig();
  const activeThemeName =
    THEMES.find((theme) => theme.value === activeTheme)?.name ?? "Theme";

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="theme-selector" className="sr-only">
        Theme
      </Label>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              id="theme-selector"
              variant="outline"
              className="justify-start"
            >
              <span className="text-muted-foreground hidden sm:block">
                <Icons.palette />
              </span>
              <span className="text-muted-foreground block sm:hidden">
                Theme
              </span>
              <span className="w-24 truncate text-left">{activeThemeName}</span>
              <Kbd>T T</Kbd>
              <IconChevronDown className="ml-1 h-3 w-3 text-muted-foreground" />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-48">
          {THEMES.length > 0 && (
            <>
              <DropdownMenuGroup>
                <DropdownMenuLabel>themes</DropdownMenuLabel>
                {THEMES.map((theme) => (
                  <DropdownMenuItem
                    key={theme.name}
                    onClick={() => setActiveTheme(theme.value)}
                  >
                    <span className="flex-1">{theme.name}</span>
                    {activeTheme === theme.value && (
                      <CheckIcon className="size-4 text-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
