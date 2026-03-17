"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, MessageCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

type History = {
  id: string;
  title: string;
};

type ChatHistoryProps = {
  history: History[];
};

const ChatHistory = ({ history: defaultHistory }: ChatHistoryProps) => {
  const pathname = usePathname();
  const [history, setHistory] = useState(defaultHistory);
  const prevHistory = useRef(history);

  useEffect(() => {
    const updateHistory = async () => {
      const id = pathname.split("/").pop()?.trim();

      if (id === "settings" || id === "chat") return;

      const existingIndex = prevHistory.current.findIndex((chat) => chat.id === id);
      if (existingIndex !== -1) return;

      // get history and update
      const { data }: { data: History } = await axios.get(`/api/chats/history/${id}`);
      const newHistory = [...prevHistory.current, data];
      prevHistory.current = newHistory;
      setHistory(newHistory);
    };

    updateHistory();
  }, [pathname]);

  return (
    <Collapsible defaultOpen className="group/collapsible group-data-[collapsible=icon]:hidden">
      <SidebarGroup>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger
            suppressHydrationWarning
            className="flex w-full items-center justify-between hover:text-sidebar-foreground"
          >
            <span>History</span>
            <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>

        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {history.map((chat) => (
                <SidebarMenuItem key={chat.id} title={chat.title}>
                  <SidebarMenuButton asChild tooltip={chat.title}>
                    <Link href={`/chat/${chat.id}`}>
                      <MessageCircle className="h-4 w-4 shrink-0" />
                      <span className="truncate">{chat.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
};

export type { History };
export default ChatHistory;
