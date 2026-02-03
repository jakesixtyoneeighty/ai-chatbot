"use client";

import { UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { AboutYouDialog } from "@/components/about-you-dialog";
import { Button } from "@/components/ui/button";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";

export function SidebarUserNav() {
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center justify-between gap-2">
        <div className="flex h-10 items-center rounded-md bg-background px-2">
          <UserButton afterSignOutUrl="/" />
        </div>
        <div className="flex items-center gap-1">
          <AboutYouDialog />
          <Button
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            className="h-10 w-10"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            size="icon"
            type="button"
            variant="ghost"
          >
            {isDark ? <Sun /> : <Moon />}
          </Button>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
