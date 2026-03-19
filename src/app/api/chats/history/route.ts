import { auth } from "@/auth";
import { getUserHistory } from "@/repositories/history.repo";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import { NextResponse } from "next/server";

export const GET = async () => {
  // TODO: implement pagination later
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(new ApiError(401, "Unauthorized"));
    }

    const response = await getUserHistory(session.user.id);

    return NextResponse.json(new ApiSuccess(200, "Chat history fetched successfully", response));
  } catch (error) {
    console.error("error in fetching user's chat history:", error);
    return NextResponse.json(new ApiError(500, "Internal server error"));
  }
};
