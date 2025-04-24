import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Multi-Step Form",
    url: "/",
    icon: Home,
  },
  {
    title: "Scanners",
    url: "/scanners",
    icon: Inbox,
  },
  {
    title: "Laporan Analisis Situs",
    url: "/report-va",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent className="mt-20">
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary/80 neon-glow-sm">
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    active={pathname === item.url}
                    className="group hover:neon-glow-sm"
                  >
                    <a
                      href={item.url}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 ${
                        pathname === item.url
                          ? "neon-glow-sm bg-primary/20"
                          : "hover:neon-glow-sm hover:bg-primary/20"
                      }`}
                    >
                      <item.icon
                        className={`text-primary ${
                          pathname === item.url ? "neon-glow-sm" : ""
                        }`}
                      />
                      <span
                        className={`${
                          pathname === item.url ? "neon-glow-sm" : ""
                        }`}
                      >
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
