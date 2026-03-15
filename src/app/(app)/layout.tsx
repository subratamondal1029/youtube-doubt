import React from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import SideBar from "@/components/layout/SideBar";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ResizablePanelGroup orientation="horizontal" className="min-h-dvh w-full rounded-lg border">
      <ResizablePanel defaultSize="25%">
        <SideBar />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize="75%">
        <div className="w-full h-full p-2">{children}</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default AppLayout;
