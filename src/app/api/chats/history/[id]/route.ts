import { auth } from "@/auth";
import { getHistoryInfo } from "@/repositories/history.repo";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "../../../../../../generated/prisma/client";

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(new ApiError(401, "Unauthorized"), { status: 401 });
    }

    const id = (await params).id;
    const data = await getHistoryInfo(id, session.user.id);

    return NextResponse.json(new ApiSuccess(200, "Fetched history info", data));
  } catch (error) {
    console.error("Error fetching chat history:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json(new ApiError(404, "History not found"), { status: 404 });
    }

    return NextResponse.json(new ApiError(500, "Failed to fetch chat history"), { status: 500 });
  }
};
