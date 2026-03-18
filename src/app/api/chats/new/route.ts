import extractYouTubeId from "@/lib/utils/extractYoutubeId";
import startNewChat, { createNewChat } from "@/lib/services/chat.service";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

import { NewChatProcesses, type NewChatProcessResponse } from "@/types/chat.types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await auth();
  const url = req.nextUrl.searchParams.get("url") || "";

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (response: NewChatProcessResponse) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(response)}\n\n`));
        if (
          response.step === NewChatProcesses.ERROR ||
          response.step === NewChatProcesses.COMPLETE
        ) {
          controller.close();
        }
      };

      if (!session || !session.user?.id) {
        return send({ step: NewChatProcesses.ERROR, error: "Unauthorized" });
      }

      const youtubeId = extractYouTubeId(url);

      if (!youtubeId) {
        return send({ step: NewChatProcesses.ERROR, error: "Invalid YouTube URL" });
      }

      const existingVideo = await prisma.video.findUnique({
        where: { id: youtubeId },
      });

      if (existingVideo) {
        createNewChat({
          userId: session.user.id,
          videoId: existingVideo.id,
          callback: send,
        });
      } else {
        startNewChat({
          id: youtubeId,
          userId: session.user.id,
          callback: send,
        });
      }

      // Cleanup on client disconnect
      req.signal.addEventListener("abort", () => {
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
