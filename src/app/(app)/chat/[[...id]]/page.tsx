import React from "react";

type ChatProps = {
  params: Promise<{
    id?: string;
  }>;
};

const Chat = async ({ params }: ChatProps) => {
  const { id } = await params;

  return <div>Chat {id}</div>;
};

export default Chat;
