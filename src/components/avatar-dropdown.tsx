"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { ToggleLeft, ToggleRight, User2 } from "lucide-react";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { redirect } from "next/navigation";

type AvatarProps = {
  user: User;
};

const availableLanguages: readonly string[] = ["ENGLISH", "HINDI", "HINGLISH"];

const AvatarDropdown = ({ user }: AvatarProps) => {
  //TODO: temporary for now use context api/redux later
  const [language, setLanguage] = useState<(typeof availableLanguages)[number]>("ENGLISH");
  const [includeTimestamps, setIncludeTimestamps] = useState<boolean>(true);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent"
          tooltip="Account"
        >
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={user.image || ""} alt="user" />
            <AvatarFallback>
              <User2 className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <span className="truncate group-data-[collapsible=icon]:hidden">{user.name}</span>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="w-full">
        <DropdownMenuGroup>
          {/* user info */}
          <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
          <DropdownMenuLabel>Free</DropdownMenuLabel> {/* temporary */}
          <DropdownMenuSeparator />
          {/* language radio buttons __ disabled now */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger disabled>Model Language</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={language} onValueChange={setLanguage}>
                  {availableLanguages.map((lang) => (
                    <DropdownMenuRadioItem key={lang} value={lang} className="capitalize">
                      {lang.toLowerCase()}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          {/* Timestamps toggle __ dropdown now */}
          <DropdownMenuItem
            className="flex justify-between items-center"
            onClick={() => setIncludeTimestamps((prev) => !prev)}
            disabled
          >
            <p>Timestamp</p>
            <button>{includeTimestamps ? <ToggleRight size="200px" /> : <ToggleLeft />}</button>
          </DropdownMenuItem>
          {/* settings link */}
          <DropdownMenuItem onClick={() => redirect("/chat/settings")}>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {/* logout button */}
        <DropdownMenuItem variant="destructive" onClick={() => signOut()}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AvatarDropdown;
