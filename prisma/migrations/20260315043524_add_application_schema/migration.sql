/*
  Warnings:

  - Added the required column `updatedAt` to the `profiles` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CHAT_LANGUAGE" AS ENUM ('HINDI', 'ENGLISH', 'HINGLISH');

-- CreateEnum
CREATE TYPE "SUBTITLE_LANGUAGE" AS ENUM ('HINDI', 'ENGLISH');

-- CreateEnum
CREATE TYPE "PLATFORM" AS ENUM ('YOUTUBE');

-- CreateEnum
CREATE TYPE "MESSAGE_ROLE" AS ENUM ('USER', 'AI');

-- CreateEnum
CREATE TYPE "AI_MODEL" AS ENUM ('SARVAM_M');

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "language" "CHAT_LANGUAGE" NOT NULL DEFAULT 'HINGLISH',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "withTimestamp" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "planId" TEXT;

-- CreateTable
CREATE TABLE "videos" (
    "id" TEXT NOT NULL,
    "remoteId" TEXT NOT NULL,
    "platform" "PLATFORM" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raw_subtitles" (
    "id" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "chunkId" TEXT NOT NULL,
    "language" "SUBTITLE_LANGUAGE" NOT NULL,
    "start" INTEGER NOT NULL,
    "end" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "raw_subtitles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chunk_subtitles" (
    "id" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "language" "SUBTITLE_LANGUAGE" NOT NULL,
    "start" INTEGER NOT NULL,
    "end" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chunk_subtitles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chats" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "videoId" TEXT,
    "model" "AI_MODEL" NOT NULL DEFAULT 'SARVAM_M',
    "systemInstructionId" TEXT NOT NULL,
    "language" "CHAT_LANGUAGE",
    "withTimestamp" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "role" "MESSAGE_ROLE" NOT NULL,
    "chatId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "language" "CHAT_LANGUAGE",
    "withTimestamp" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_instructions" (
    "id" TEXT NOT NULL,
    "language" "CHAT_LANGUAGE" NOT NULL DEFAULT 'ENGLISH',
    "model" "AI_MODEL" NOT NULL DEFAULT 'SARVAM_M',
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_instructions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "videos_remoteId_platform_key" ON "videos"("remoteId", "platform");

-- CreateIndex
CREATE INDEX "raw_subtitles_videoId_idx" ON "raw_subtitles"("videoId");

-- CreateIndex
CREATE INDEX "raw_subtitles_start_end_idx" ON "raw_subtitles"("start", "end");

-- CreateIndex
CREATE INDEX "chunk_subtitles_videoId_idx" ON "chunk_subtitles"("videoId");

-- CreateIndex
CREATE INDEX "chunk_subtitles_start_end_idx" ON "chunk_subtitles"("start", "end");

-- CreateIndex
CREATE INDEX "chats_userId_idx" ON "chats"("userId");

-- CreateIndex
CREATE INDEX "chats_videoId_idx" ON "chats"("videoId");

-- CreateIndex
CREATE INDEX "messages_chatId_idx" ON "messages"("chatId");

-- CreateIndex
CREATE INDEX "system_instructions_model_language_idx" ON "system_instructions"("model", "language");

-- AddForeignKey
ALTER TABLE "raw_subtitles" ADD CONSTRAINT "raw_subtitles_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "videos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raw_subtitles" ADD CONSTRAINT "raw_subtitles_chunkId_fkey" FOREIGN KEY ("chunkId") REFERENCES "chunk_subtitles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chunk_subtitles" ADD CONSTRAINT "chunk_subtitles_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "videos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "videos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_systemInstructionId_fkey" FOREIGN KEY ("systemInstructionId") REFERENCES "system_instructions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;
