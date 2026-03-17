import NewChat from "./(components)/new-chat";
import Player from "./(components)/player";
import Settings from "./(components)/settings";

const getPage = (id?: string) => {
  if (!id) return <NewChat />;

  if (id === "settings") {
    return <Settings />;
  }

  return <Player id={id} />;
};

type ChatProps = {
  params: Promise<{
    id?: string;
  }>;
};

const Chat = async ({ params }: ChatProps) => {
  const { id } = await params;

  return <div className="w-full min-h-screen pl-2">{getPage(id)}</div>;
};

export default Chat;
