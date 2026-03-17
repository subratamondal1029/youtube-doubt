import { auth } from "@/auth";
import { getHistoryInfo } from "@/lib/repositories/history.repo";
import { ApiError } from "@/lib/utils/ApiError";
import { ApiSuccess } from "@/lib/utils/ApiSuccess";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(new ApiError(401, "Unauthorized"));
    }

    const id = (await params).id;
    const data = await getHistoryInfo(id, session.user.id);

    return NextResponse.json(new ApiSuccess(200, "Fetched history info", data));
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return NextResponse.json(new ApiError(500, "Failed to fetch chat history"));
  }
};
