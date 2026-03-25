import YtPlayer from "./player";
import { type ChatInfo, getChatInfo } from "@/lib/repositories/chat.repo";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import Chat from "./chat";
import { notFound } from "next/navigation";
import { validate as isUuid } from "uuid";

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

  if (!id || !isUuid(id)) {
    return notFound();
  }

  const chatData = await getChatData(id);

  if (!chatData) {
    return notFound();
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
