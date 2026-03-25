import { validate } from "uuid";
import { ApiError } from "@/utils/ApiError";
import prisma from "../prisma";

const getUserProfile = async (userId: string) => {
  try {
    if (!userId || !validate(userId)) {
      throw new ApiError(400, "Invalid user ID");
    }

    const profile = await prisma.profile.findUnique({
      where: {
        userId,
      },
    });

    if (!profile) {
      throw new ApiError(404, "Profile not found");
    }

    return profile;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else {
      console.error("Error occurred while fetching user profile:", error);
      throw new ApiError(500, "An unexpected error occurred");
    }
  }
};

export { getUserProfile };
