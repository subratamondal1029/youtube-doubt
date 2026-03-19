"use client";

import Logo from "@/components/Logo";
import { useSidebar } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CirclePlus, Sidebar } from "lucide-react";
import Link from "next/link";

const SideBarHeaderShortcut = () => {
  const { state, setOpen } = useSidebar();

  if (state === "expanded") return null;

  return (
    <div className="flex-col justify-between items-center gap-4 py-4 hidden group-data-[collapsible=icon]:flex border-b border-sidebar-border/70">
      <div className="w-10 h-10 rounded-full border flex justify-center items-center">
        <Logo href="/chat" />
      </div>
      <Tooltip>
        <TooltipTrigger
          onClick={() => setOpen(true)}
          className=" h-9 w-9 flex justify-center items-center hover:bg-white/10 rounded-lg"
        >
          <Sidebar className="h-4 w-4 cursor-e-resize" />
        </TooltipTrigger>
        <TooltipContent side="right">Toggle Sidebar</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <Link
            href="/chat"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-sidebar-foreground hover:bg-white/10 transition-colors"
          >
            <CirclePlus className="h-4 w-4" />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">New Chat</TooltipContent>
      </Tooltip>
    </div>
  );
};

export default SideBarHeaderShortcut;
