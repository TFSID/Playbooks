"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/app-sidebar";
import { AppHeader } from "@/components/layouts/app-header";

const AppLayout = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col w-full">
        <AppHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <main className="flex-1 overflow-auto">
            <div className="px-6 py-4">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
export default AppLayout;
