import KBar from "@/components/kbar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <KBar>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <div className="flex-1">
            <div className="mx-auto w-full px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  );
}
