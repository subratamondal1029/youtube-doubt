import YtPlayer from "./player";
import { type ChatInfo, getChatInfo } from "@/lib/repositories/chat.repo";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import Chat from "./chat";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

type PlayerProps = {
  params: Promise<{
    id: string;
  }>;
};

const getChatData = async (id: string): Promise<ChatInfo | null> => {
  try {
    const data = await getChatInfo(id);

    if (!data || !data.video || !data.video.remoteId) {
      throw new Error("Invalid chat data");
    }

    return data;
  } catch (error) {
    console.error("Error fetching chat data:", error);
    return null;
  }
};

const Player = async ({ params }: PlayerProps) => {
  const { id } = await params;

  const chatData = await getChatData(id);

  if (!chatData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">404</h1>
          <p className="text-lg text-muted-foreground">Chat not found</p>
          <Link href="/chat" className={`${buttonVariants()} mt-4 cursor-pointer`}>
            <Plus /> <p>New Chat</p>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ResizablePanelGroup orientation="horizontal">
      <ResizablePanel defaultSize="75%">
        {chatData.video && <YtPlayer video={chatData.video} />}
      </ResizablePanel>
      <ResizableHandle
        withHandle
        className="transition-colors duration-200 hover:bg-primary/40 data-resize-handle-active:bg-primary/50 [&>div]:transition-all [&>div]:duration-200 hover:[&>div]:h-10 hover:[&>div]:bg-primary data-resize-handle-active:[&>div]:bg-primary"
      />
      <ResizablePanel defaultSize="25%" maxSize="35%">
        <Chat chat={chatData} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Player;
