import { CHUNK_DURATION } from "@/constant";
import { getVideoDetails, VideoDetails } from "youtube-caption-extractor";
import prisma from "../prisma";

type CallbackArgs = {
  step: number;
  message: string;
  data: Record<string, unknown>;
};

type NewChatArgs = {
  id: string;
  userId: string;
  callback: ({ step, message, data }: CallbackArgs) => void;
  errorCallback: (error: string) => void;
};

type Subtitle = {
  start: number;
  end: number;
  content: string;
};

type Data = {
  title: string;
  description: string;
  rawSubtitles?: Subtitle[];
  chunkSubtitles?: Subtitle[];
};

export const createNewChat = async ({
  userId,
  videoId,
  callback,
}: {
  userId: string;
  videoId: string;
  callback: (args: CallbackArgs) => void;
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
    throw new Error("System instruction not found");
  }

  callback({ step: 5, message: "Model initialized.", data: {} });

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

  callback({ step: 6, message: "Chat initialized.", data: { chatId: chat.id } });
};

const startNewChat = async ({ id, userId, callback, errorCallback }: NewChatArgs) => {
  try {
    callback({ step: 1, message: "Fetching video information...", data: {} });

    const videoInfo: VideoDetails = await getVideoDetails({
      videoID: id,
      lang: "en",
    });

    const data: Data = {
      title: videoInfo.title,
      description: videoInfo.description,
    };

    callback({ step: 2, message: "Video title and description fetched.", data });

    // format subtitle as per requirement
    const subtitles = videoInfo.subtitles.map((subtitle) => ({
      start: Math.floor(Number(subtitle.start)),
      end: Math.floor(Number(subtitle.start) + Number(subtitle.dur)),
      content: subtitle.text,
    }));

    data.rawSubtitles = subtitles;

    const lastSub = subtitles[subtitles.length - 1].end;

    callback({ step: 3, message: `Subtitles fetched upto ${lastSub}.`, data: {} });

    // create 40s chunk from raw subtitles
    const chunkDuration = CHUNK_DURATION;
    const chunkSubtitles: Subtitle[] = [];

    let currentChunk: Subtitle | null = null;

    for (const subtitle of subtitles) {
      if (!currentChunk) {
        currentChunk = { ...subtitle };
      } else if (subtitle.start - currentChunk.start < chunkDuration) {
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

    data.chunkSubtitles = chunkSubtitles;

    callback({ step: 4, message: "Subtitles processed.", data: {} });

    const dbVideo = await prisma.video.create({
      data: {
        title: data.title,
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

    //   TODO: add chunkId in raw subtitles in future

    await createNewChat({ userId, videoId: dbVideo.id, callback });
  } catch (error) {
    let errorMessage = "An error occurred while processing the request";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    errorCallback(errorMessage);
  }
};

export default startNewChat;
