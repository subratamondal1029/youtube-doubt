import { AI_MODEL, CHAT_LANGUAGE } from "../../../generated/prisma/enums";
import { ApiError } from "@/utils/ApiError";
import prisma from "../prisma";

const getSystemPrompt = async (language: CHAT_LANGUAGE, model: AI_MODEL) => {
  try {
    const systemPrompt = await prisma.systemInstruction.findFirst({
      where: {
        language,
        model,
      },
      select: {
        content: true,
      },
    });

    if (!systemPrompt) {
      throw new ApiError(404, "System prompt not found");
    }

    return systemPrompt.content;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Failed to get system prompt");
  }
};

export { getSystemPrompt };
