import { CHUNK_DURATION } from "@/constant";
import { fetchTranscript, type TranscriptResponse } from "youtube-transcript-plus";
import prisma from "@/lib/prisma";
import { ApiError } from "@/utils/ApiError";
import cleanContent from "@/utils/cleanContent";
import axios from "axios";

import { Subtitle, NewChatProcesses, NewChatProcessResponse } from "@/types/chat.types";

/*
Tasks
TODO: make language dynamic
TODO: make platform dynamic
TODO: add chunkId in raw subtitles
*/

interface VideoInfo {
  title: string;
  description: string;
}

interface Data extends VideoInfo {
  rawSubtitles?: Subtitle[];
  chunkSubtitles?: Subtitle[];
}

const getVideoDetails = async (videoId: string): Promise<VideoInfo> => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`
    );

    const snippet = response.data.items[0].snippet;

    return {
      title: snippet.title,
      description: cleanContent(snippet.description),
    };
  } catch (error) {
    console.error("Error fetching video details:", error);
    throw new ApiError(500, "Failed to fetch video details");
  }
};

const getSubtitles = async (
  videoId: string,
  lang: string = "en"
): Promise<TranscriptResponse[]> => {
  try {
    const response = await fetchTranscript(videoId, {
      lang,
    });

    return response;
  } catch (error) {
    console.error("Error fetching subtitles:", error);
    throw new ApiError(500, "Failed to fetch subtitles");
  }
};

const formatSubtitles = (
  subtitles: TranscriptResponse[]
): { rawSubtitles: Subtitle[]; chunkSubtitles: Subtitle[] } => {
  const rawSubtitles = subtitles.map((t) => ({
    start: t.offset,
    end: parseFloat((t.offset + t.duration).toFixed(2)),
    content: cleanContent(t.text),
  }));

  const chunkSubtitles: Subtitle[] = [];

  let currentChunk: Subtitle | null = null;

  for (const subtitle of rawSubtitles) {
    if (!currentChunk) {
      currentChunk = { ...subtitle };
    } else if (subtitle.start - currentChunk.start < CHUNK_DURATION) {
      currentChunk.content += " " + subtitle.content;
      currentChunk.end = subtitle.end;
    } else {
      chunkSubtitles.push(currentChunk);
      currentChunk = { ...subtitle };
    }
  }

  if (currentChunk) {
    chunkSubtitles.push(currentChunk);
  }

  return { rawSubtitles, chunkSubtitles };
};

export const createNewChat = async ({
  userId,
  videoId,
  callback,
}: {
  userId: string;
  videoId: string;
  callback: (args: NewChatProcessResponse) => void;
}) => {
  const systemInstruction = await prisma.systemInstruction.findFirst({
    where: {
      AND: {
        language: "HINGLISH",
        model: "SARVAM_M",
      },
    },
    select: {
      id: true,
    },
  });

  if (!systemInstruction) {
    throw new ApiError(500, "System instruction not found");
  }

  callback({ step: NewChatProcesses.INITIALIZE_CHAT, message: "Model initialized.", data: {} });

  const chat = await prisma.chat.create({
    data: {
      language: "HINGLISH",
      withTimestamp: true,
      systemInstructionId: systemInstruction.id,
      userId,
      videoId,
    },
    select: {
      id: true,
    },
  });

  callback({
    step: NewChatProcesses.COMPLETE,
    message: "Chat initialized.",
    data: { chatId: chat.id },
  });
};

const startNewChat = async ({
  id,
  userId,
  callback,
}: {
  id: string;
  userId: string;
  callback: (args: NewChatProcessResponse) => void;
}) => {
  try {
    callback({
      step: NewChatProcesses.INITIALIZING,
      message: "Fetching video information...",
      data: {},
    });

    const videoInfo = await getVideoDetails(id);

    const data: Data = { ...videoInfo };

    callback({
      step: NewChatProcesses.FETCHED_VIDEO_DETAILS,
      message: "Video title and description fetched.",
      data,
    });

    // format subtitle as per requirement
    const subtitleResponse: TranscriptResponse[] = await getSubtitles(id);

    const lastSub = subtitleResponse[subtitleResponse.length - 1];
    const lastSubEnd = Math.floor(lastSub.offset + lastSub.duration);

    callback({
      step: NewChatProcesses.FETCHED_SUBTITLES,
      message: `Subtitles fetched upto ${lastSubEnd}.`,
      data: { length: lastSubEnd },
    });

    // format subtitles
    const { rawSubtitles, chunkSubtitles } = formatSubtitles(subtitleResponse);

    data.rawSubtitles = rawSubtitles;
    data.chunkSubtitles = chunkSubtitles;

    callback({
      step: NewChatProcesses.PROCESSED_SUBTITLES,
      message: "Subtitles processed.",
      data: {},
    });

    const dbVideo = await prisma.video.create({
      data: {
        title: data.title,
        description: data.description,
        remoteId: id,
        platform: "YOUTUBE",
      },
      select: {
        id: true,
      },
    });

    await prisma.rawSubtitle.createMany({
      data: data.rawSubtitles?.map((subtitle) => ({
        language: "ENGLISH",
        start: subtitle.start,
        end: subtitle.end,
        content: subtitle.content,
        videoId: dbVideo.id,
      })),
    });

    await prisma.chunkSubtitle.createMany({
      data: data.chunkSubtitles?.map((subtitle) => ({
        language: "ENGLISH",
        start: subtitle.start,
        end: subtitle.end,
        content: subtitle.content,
        videoId: dbVideo.id,
      })),
    });

    await createNewChat({ userId, videoId: dbVideo.id, callback });
  } catch (error) {
    console.error("Error processing video:", error);
    let errorMessage = "An error occurred while processing the request";
    if (error instanceof ApiError) {
      errorMessage = error.message;
    }
    callback({ step: NewChatProcesses.ERROR, error: errorMessage });
  }
};

export default startNewChat;
