import { Orbit } from "lucide-react";
import Link from "next/link";
import { navItems } from "../constants/landing-data";

export function Header() {
  return (
    <header
      data-hero-reveal
      data-marketing-header
      className="fixed inset-x-4 top-5 z-[100] mx-auto flex w-auto max-w-[calc(100vw-2rem)] items-center justify-between rounded-full border border-white/10 bg-background/75 px-4 py-3 shadow-2xl shadow-black/20 backdrop-blur-2xl backdrop-saturate-150 sm:inset-x-6 sm:max-w-[calc(100vw-3rem)] lg:inset-x-8 lg:max-w-[calc(100vw-4rem)]"
    >
      <Link href="/" className="flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.06]">
          <Orbit className="size-4" />
        </span>
        <span className="text-sm font-semibold tracking-wide">Lamarin</span>
      </Link>

      <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="transition hover:text-foreground"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="hidden rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground sm:inline-flex"
        >
          Log in
        </Link>

        <Link
          href="/register"
          className="inline-flex items-center rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:scale-[1.02]"
        >
          Sign up
        </Link>
      </div>
    </header>
  );
}
