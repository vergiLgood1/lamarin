"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { signOut, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "../breadcrumbs";
import SearchInput from "../search-input";
import { ThemeModeToggle } from "../themes/theme-mode-toggle";
import { ThemeSelector } from "../themes/theme-selector";
import { Separator } from "../ui/separator";

export function Header() {
  const router = useRouter();
  const { data: session } = useSession();

  const user = session?.user;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  async function handleSignOut() {
    await signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    // </header>
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 border-b px-3 sm:px-4 lg:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* <CtaGithub /> */}
        <div className="hidden md:flex">
          <SearchInput />
        </div>
        <ThemeModeToggle />
        <div className="hidden sm:block">
          <ThemeSelector />
        </div>
        {/* <NotificationCenter /> */}
      </div>
    </header>
  );
}
