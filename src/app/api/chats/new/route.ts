import extractYouTubeId from "@/lib/utils/extractYoutubeId";
import startNewChat from "@/lib/services/chat.service";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await auth();
  const { url }: { url: string } = await req.json();

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      const sendError = (error: string) => {
        send({ message: "video processing failed", data: null, error });
        controller.close();
      };

      if (!session || !session.user?.id) {
        return sendError("Unauthorized");
      }

      const youtubeId = extractYouTubeId(url);

      if (!youtubeId) {
        return sendError("Invalid YouTube URL");
      }

      startNewChat({
        id: youtubeId,
        userId: session.user.id,
        callback: send,
        errorCallback: sendError,
      });

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
