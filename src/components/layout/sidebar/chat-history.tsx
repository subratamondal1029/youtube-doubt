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
import { useEffect, useState } from "react";
import { useAppContext } from "@/app/context/AppContext";
import { STATIC_CHAT_ENDPOINTS } from "@/constant";

type History = {
  id: string;
  title: string;
};

type ChatHistoryProps = {
  history: History[];
};

const ChatHistory = ({ history: defaultHistory }: ChatHistoryProps) => {
  const pathname = usePathname();
  const [chatId, setChatId] = useState<string>("");

  const { history, setHistory } = useAppContext();

  // set initial history
  useEffect(() => {
    const setInitialHistory = () => {
      setHistory(defaultHistory);
    };

    setInitialHistory();
  }, [defaultHistory, setHistory]);

  // set current chat id
  useEffect(() => {
    const setCurrentChatId = () => {
      setChatId("");
      const chatId = pathname.split("/").pop();

      if (!chatId || chatId === "" || STATIC_CHAT_ENDPOINTS.includes(chatId)) {
        return;
      }

      setChatId(chatId);
    };

    setCurrentChatId();
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
                  <SidebarMenuButton
                    asChild
                    tooltip={chat.title}
                    className={
                      chatId === chat.id ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                    }
                  >
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
