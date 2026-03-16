"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

const shortcuts = [
  { icon: Settings, label: "Settings", href: "/chat/settings" },
  {
    icon: LogOut,
    label: "Logout",
    onClick: () => signOut(),
  },
] as const;

export default function SidebarFooterShortcut() {
  const { state, isMobile } = useSidebar();
  if (state === "expanded" || isMobile) return null;

  return (
    <div className="flex flex-col items-center gap-2 py-3 border-t border-sidebar-border/70">
      {shortcuts.map((shortcut) => {
        const Icon = shortcut.icon;

        return (
          <Tooltip key={shortcut.label}>
            <TooltipTrigger asChild>
              {"href" in shortcut ? (
                <Link
                  href={shortcut.href}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-sidebar-foreground hover:bg-white/10 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ) : (
                <button
                  onClick={shortcut.onClick}
                  className={`cursor-pointer flex h-9 w-9 items-center justify-center rounded-lg text-sidebar-foreground transition-colors ${shortcut.label === "Logout" ? "hover:bg-red-500" : "hover:bg-white/10"}`}
                >
                  <Icon className="h-4 w-4" />
                </button>
              )}
            </TooltipTrigger>
            <TooltipContent side="right">{shortcut.label}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
