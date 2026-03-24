import { auth } from "@/auth";
import { getMessages } from "@/lib/repositories/chat.repo";
import { ApiError } from "@/lib/utils/ApiError";
import { NextRequest, NextResponse } from "next/server";
import { validate } from "uuid";
import { CHAT_LANGUAGE, MESSAGE_ROLE } from "../../../../../../generated/prisma/enums";
import { MAX_MESSAGES_PER_CHAT } from "@/constant";
import { getVideoSubtitlesByTimestamp } from "@/lib/repositories/video.repo";
import aiService from "@/lib/services/ai.service";

type MessagePayload = {
  message: string;
  language?: CHAT_LANGUAGE;
  timestamp?: number;
};

export const POST = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const { message, language, timestamp } = (await req.json()) as MessagePayload;

    // TODO: do validation with zod
    if (!id || !validate(id)) {
      throw new ApiError(400, "Invalid message ID");
    }

    if (!message || !message.trim()) {
      throw new ApiError(400, "Message content is required");
    }

    if (language && !Object.values(CHAT_LANGUAGE).includes(language)) {
      throw new ApiError(400, "Invalid language");
    }

    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      throw new ApiError(401, "Unauthorized");
    }

    const messages = await getMessages(id);

    const messagesCount = messages.filter((msg) => msg.role === MESSAGE_ROLE.USER).length;

    //NOTE: for temporary limit
    if (messagesCount >= MAX_MESSAGES_PER_CHAT) {
      throw new ApiError(429, "Maximum messages per chat exceeded");
    }

    let subtitles;
    if (timestamp !== undefined) {
      await getVideoSubtitlesByTimestamp(id, timestamp);
    }

    const responseStream = await aiService.send(
      id,
      session.user.id,
      messages,
      message,
      subtitles,
      timestamp,
      language
    );

    return new NextResponse(responseStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    let errorResponse: ApiError;
    if (error instanceof ApiError) {
      errorResponse = error;
    } else {
      errorResponse = new ApiError(500, "An unexpected error occurred");
    }
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
  }
};
