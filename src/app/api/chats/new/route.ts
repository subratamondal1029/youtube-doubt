import extractYouTubeId from "@/utils/extractYoutubeId";
import startNewChat, { createNewChat } from "@/services/chat.service";
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
      let isClosed = false;

      const closeController = () => {
        if (isClosed) return;
        isClosed = true;
        controller.close();
      };

      // Register disconnect cleanup before any await so abort events are not missed.
      req.signal.addEventListener("abort", () => {
        closeController();
      });

      if (req.signal.aborted) {
        closeController();
        return;
      }

      const send = (response: NewChatProcessResponse) => {
        if (isClosed) return;
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(response)}\n\n`));
        if (
          response.step === NewChatProcesses.ERROR ||
          response.step === NewChatProcesses.COMPLETE
        ) {
          closeController();
        }
      };

      if (!session || !session.user?.id) {
        return send({ step: NewChatProcesses.ERROR, error: "Unauthorized" });
      }

      const youtubeId = extractYouTubeId(url);

      if (!youtubeId) {
        return send({ step: NewChatProcesses.ERROR, error: "Invalid YouTube URL" });
      }

      try {
        const existingVideo = await prisma.video.findUnique({
          where: { remoteId_platform: { remoteId: youtubeId, platform: "YOUTUBE" } },
        });

        if (existingVideo) {
          send({
            step: NewChatProcesses.FETCHED_VIDEO_DETAILS,
            message: "Video title and description fetched.",
            data: {
              title: existingVideo.title,
              description: existingVideo.description ?? "",
            },
          });

          await createNewChat({
            userId: session.user.id,
            videoId: existingVideo.id,
            callback: send,
          });
        } else {
          await startNewChat({
            id: youtubeId,
            userId: session.user.id,
            callback: send,
          });
        }
      } catch (error) {
        console.error("Error in chat creation:", error);
        send({ step: NewChatProcesses.ERROR, error: "Failed to create chat" });
      }
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
