import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import { lora, plusJakartaSans, robotoMono } from "./font";
import "./globals.css";

export const metadata: Metadata = {
  title: "Applyorbit - Job Application Tracker",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} ${lora.variable} ${robotoMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: colorSchemeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <Toaster position="top-right" />
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
