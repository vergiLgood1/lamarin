import Providers from "@/components/layout/providers";
import { fontVariables } from "@/components/themes/font.config";
import ThemeProvider from "@/components/themes/theme-provider";
import { DEFAULT_THEME, THEMES } from "@/components/themes/theme.config";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import Script from "next/script";
import "../styles/globals.css";

const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light,
};

export const metadata: Metadata = {
  title: "lamarin - Job Application Tracker",
  description:
    "Track and manage your job applications with AI-powered follow-up emails",
};

// Inline script to apply color scheme class before first paint (prevents flash)
const colorSchemeScript = `
(function() {
  try {
    var scheme = localStorage.getItem('color-scheme');
    if (scheme && scheme !== 'default') {
      document.documentElement.classList.add('theme-' + scheme);
    }
  } catch(e) {}
})();
`;

const metaTheme = `
(function() {
try {
// Set meta theme color
if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '${META_THEME_COLORS.dark}')}} catch (_) {}
})();
`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get("active_theme")?.value;
  const isValidTheme = THEMES.some((t) => t.value === activeThemeValue);
  const themeToApply = isValidTheme ? activeThemeValue! : DEFAULT_THEME;

  return (
    <html
      lang="id"
      // className={`${plusJakartaSans.variable} ${lora.variable} ${robotoMono.variable} h-full antialiased`}
      suppressHydrationWarning
      data-theme={themeToApply}
    >
      <head>
        <Script id="meta-theme" strategy="beforeInteractive">
          {metaTheme}
        </Script>
      </head>
      <body
        className={cn(
          "bg-background overflow-x-hidden overscroll-none font-sans antialiased",
          fontVariables,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          <Providers activeThemeValue={themeToApply}>
            <Toaster position="top-right" />
            <TooltipProvider>{children}</TooltipProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
