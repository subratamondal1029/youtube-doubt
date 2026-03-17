import React from "react";

type PlayerProps = {
  params: Promise<{
    id: string;
  }>;
};

const Player = async ({ params }: PlayerProps) => {
  const { id } = await params;

  return <div>Player: {id}</div>;
};

export default Player;
