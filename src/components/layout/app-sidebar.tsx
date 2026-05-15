"use client"

import { useSession } from "@/lib/auth-client"
import { usePathname } from "next/navigation"
import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { FileText, LayoutDashboard, Mail, Orbit, Settings } from "lucide-react"
import Link from "next/link"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const user = session?.user

  const navMain = [
    {
      title: "Dashboard",
      url: "/dashboard/overview",
      icon: <LayoutDashboard />,
      isActive: pathname === "/dashboard/overview",
    },
    {
      title: "Lamaran",
      url: "/dashboard/applications",
      icon: <FileText />,
      isActive: pathname.startsWith("/dashboard/applications"),
    },
    {
      title: "Follow-up",
      url: "/dashboard/follow-ups/overview",
      icon: <Mail />,
      items: [
        {
          title: "Overview",
          url: "/dashboard/follow-ups/overview",
          isActive: pathname === "/dashboard/follow-ups/overview",
        },
        {
          title: "Compose",
          url: "/dashboard/follow-ups/compose",
          isActive: pathname.startsWith("/dashboard/follow-ups/compose"),
        },
      ],
    },
    {
      title: "Pengaturan",
      url: "/dashboard/settings",
      icon: <Settings />,
      isActive: pathname.startsWith("/dashboard/settings"),
    },
  ];

  const userData = {
    name: user?.name || "User",
    email: user?.email || "user@applyorbit.com",
    avatar: user?.image || "",
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <Link
                href="/dashboard/overview"
                className="flex gap-2 items-center"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Orbit className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Lamarin</span>
                  <span className="truncate text-xs">Hobby</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
