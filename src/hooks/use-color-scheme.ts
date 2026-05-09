"use client";

import { useCallback, useEffect, useState } from "react";

const COLOR_SCHEME_KEY = "color-scheme";
const DEFAULT_SCHEME = "default";

export function useColorScheme() {
  const [scheme, setSchemeState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(COLOR_SCHEME_KEY) || DEFAULT_SCHEME;
    }
    return DEFAULT_SCHEME;
  });

  useEffect(() => {
    const html = document.documentElement;

    const classes = Array.from(html.classList);

    classes.forEach((cls) => {
      if (cls.startsWith("theme-")) html.classList.remove(cls);
    });

    if (scheme !== DEFAULT_SCHEME) {
      html.classList.add(`theme-${scheme}`);
    }

    localStorage.setItem(COLOR_SCHEME_KEY, scheme);
  }, [scheme]);

  const setScheme = useCallback((newScheme: string) => {
    setSchemeState(newScheme);
  }, []);

  return { scheme, setScheme };
}
