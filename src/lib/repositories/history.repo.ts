import prisma from "../prisma";

export const getUserHistory = async (userId: string) => {
  const history = await prisma.chat.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      video: {
        select: {
          title: true,
        },
      },
    },
  });

  return history.map((item) => ({
    id: item.id,
    title: item.video?.title || "Untitled",
  }));
};

export const getHistoryInfo = async (historyId: string, userId: string) => {
  const history = await prisma.chat.findUniqueOrThrow({
    where: {
      id: historyId,
      userId,
    },
    select: {
      id: true,
      video: {
        select: {
          title: true,
        },
      },
    },
  });

  return {
    id: history.id,
    title: history.video?.title || "Untitled",
  };
};
