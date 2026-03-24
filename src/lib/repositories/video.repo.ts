import { auth } from "@/auth";
import { ApiError } from "@/utils/ApiError";
import prisma from "../prisma";
import { validate } from "uuid";

const getVideoSubtitlesByTimestamp = async (id: string, timestamp: number) => {
  try {
    if (!validate(id)) {
      throw new ApiError(400, "Invalid video ID");
    }

    const session = await auth();

    if (!session || !session.user) {
      throw new ApiError(401, "Unauthorized");
    }

    // get subtitles of this video with +-90s of the given timestamp
    // start >= minimum
    // end <= maximum
    const minimumT = timestamp - 90;
    const maximumT = timestamp + 90;

    const subtitles = await prisma.chunkSubtitle.findMany({
      where: {
        videoId: id,
        start: {
          gte: minimumT,
        },
        end: {
          lte: maximumT,
        },
      },
    });

    return subtitles;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw new ApiError(500, "An unexpected error occurred");
    }
  }
};

export { getVideoSubtitlesByTimestamp };
