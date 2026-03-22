import { ApiError } from "@/utils/ApiError";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { MESSAGE_ROLE } from "../../../generated/prisma/enums";
import { validate } from "uuid";

const getChatInfo = async (chatId: string) => {
  try {
    if (!chatId || !validate(chatId)) {
      throw new ApiError(400, "Invalid chat ID");
    }

    const session = await auth();

    if (!session || !session.user?.id) {
      throw new ApiError(401, "Unauthorized");
    }

    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userId: session.user.id,
      },
      include: {
        video: {
          select: {
            id: true,
            remoteId: true,
            platform: true,
            title: true,
            description: true,
          },
        },
        user: {
          select: {
            id: true,
            profile: {
              select: {
                language: true,
                withTimestamp: true,
                personalization: true,
              },
            },
          },
        },
        messages: {
          orderBy: {
            createdAt: "asc",
          },
          omit: {
            chatId: true,
          },
        },
      },
      omit: {
        systemInstructionId: true,
      },
    });

    if (!chat) {
      console.log("Chat not found:", chat);
      throw new ApiError(404, "Chat not found");
    }

    return chat;
  } catch (error) {
    console.error("Error occurred while fetching chat info:", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Failed to fetch chat info");
  }
};

const createMessage = async (chatId: string, content: string, role: MESSAGE_ROLE = "USER") => {
  try {
    if (!chatId || !content) {
      throw new ApiError(400, "Invalid chat ID or content");
    }

    const session = await auth();

    if (!session || !session.user?.id) {
      throw new ApiError(401, "Unauthorized");
    }

    const message = await prisma.message.create({
      data: {
        chatId,
        role,
        content,
      },
      select: {
        id: true,
      },
    });

    return message;
  } catch (error) {
    console.error("Error occurred while creating message:", error);
    throw new ApiError(500, "Failed to create message");
  }
};

const getMessage = async (messageId: string) => {
  try {
    if (!messageId) {
      throw new ApiError(400, "Invalid message ID");
    }

    const session = await auth();

    if (!session || !session.user?.id) {
      throw new ApiError(401, "Unauthorized");
    }

    const message = await prisma.message.findUnique({
      where: {
        id: messageId,
        chat: {
          userId: session.user.id,
        },
      },
    });

    if (!message) {
      throw new ApiError(404, "Message not found");
    }

    return message;
  } catch (error) {
    console.error("Error occurred while fetching message:", error);
    throw new ApiError(500, "Failed to fetch message");
  }
};

type ChatInfo = Awaited<ReturnType<typeof getChatInfo>>;

export { getChatInfo, createMessage, getMessage };
export type { ChatInfo };
