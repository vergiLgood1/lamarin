import { Orbit } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <>
      <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.06]">
              <Orbit className="size-4" />
            </span>
            <span className="text-sm font-semibold tracking-wide">Lamarin</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">
            Job application tracker and follow-up workspace to keep the application
            process visible and organized.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold">Product</p>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <a href="#features" className="block hover:text-foreground">
              Features
            </a>
            <a href="#workflow" className="block hover:text-foreground">
              Workflow
            </a>
            <a href="#integrations" className="block hover:text-foreground">
              Integrations
            </a>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold">Workspace</p>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <Link href="/dashboard/overview" className="block hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/dashboard/applications" className="block hover:text-foreground">
              Applications
            </Link>
            <Link href="/dashboard/send-email" className="block hover:text-foreground">
              Send Email
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold">Account</p>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <Link href="/login" className="block hover:text-foreground">
              Log in
            </Link>
            <Link href="/register" className="block hover:text-foreground">
              Sign up
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-6xl flex-col justify-between gap-3 border-t border-white/10 pt-6 text-sm text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} Lamarin. All rights reserved.</p>
        <p>Built for organized job search workflows.</p>
      </div>
    </>
  );
}
