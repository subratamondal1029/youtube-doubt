import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { CirclePlus } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/Logo";
import ChatHistory, { type History } from "@/components/layout/sidebar/chat-history";
import SidebarFooterShortcuts from "@/components/layout/sidebar/sidebar-footer-shortcut";
import AvatarDropdown from "@/components/avatar-dropdown";
import SideBarHeaderShortcuts from "@/components/layout/sidebar/sidebar-header-shortcut";
import type { User } from "next-auth";
import SendToast from "@/components/send-toast";
import { getUserHistory } from "@/repositories/history.repo";

const getHistory = async (userId?: string) => {
  if (!userId) return [];

  try {
    return await getUserHistory(userId);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return null;
  }
};

type SideBarProps = {
  user: User;
};

const SideBar = async ({ user }: SideBarProps) => {
  let error: string | undefined;
  let history: History[] = [];

  const response = await getHistory(user.id);

  if (response === null) {
    error = "Failed to fetch chat history";
  } else {
    history = response;
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border/70">
      {/* ── HEADER ── */}
      <SideBarHeaderShortcuts />
      <SidebarHeader className="px-3 pt-5 pb-3 group-data-[collapsible=icon]:hidden">
        <div className="rounded-2xl border border-white/15 bg-black/60 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          {/* Logo — always visible */}
          <div className="w-full flex justify-between items-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5">
              <Logo href="/chat" />
            </div>
            <SidebarTrigger className="cursor-w-resize" />
            {/* search here */}
          </div>

          {/* New Chat — text hidden when collapsed */}
          <SidebarMenu className="mt-3">
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="New Chat"
                className="h-10 rounded-xl bg-white/5 text-sidebar-foreground hover:bg-white/10"
              >
                <Link href="/chat">
                  <CirclePlus className="h-4 w-4 shrink-0" />
                  <span className="text-[15px]">New Chat</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarHeader>

      {/* ── CONTENT: Chat History ── */}
      <SidebarContent>
        {error && <SendToast variant="error" message={error} />}
        <ChatHistory history={history} />
      </SidebarContent>

      {/* ── FOOTER: Avatar + collapsed shortcuts ── */}
      <SidebarFooter className="p-0">
        {/* Collapsed-only shortcut buttons */}
        <SidebarFooterShortcuts />

        {/* Avatar dropdown */}
        <SidebarMenu className="p-2">
          <SidebarMenuItem>
            <AvatarDropdown user={user} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

export default SideBar;
