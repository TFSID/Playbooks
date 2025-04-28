"use client";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-primary/20 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 neon-box-glow-sm">
      <div className="flex items-center gap-2 sm:gap-4">
        <SidebarTrigger />
        <h1 className="text-base sm:text-xl font-semibold neon-glow text-primary whitespace-nowrap">
          SOC Playbooks
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search input - tampil hanya di sm ke atas */}
        <div className="relative hidden sm:block w-48 md:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-10 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          />
        </div>

        {/* Tombol profile - responsif */}
        <Button
          variant="outline"
          className="neon-box-glow-sm hover:neon-box-glow px-3 py-1 text-sm sm:text-base"
        >
          Profile
        </Button>
      </div>
    </header>
  );
}
