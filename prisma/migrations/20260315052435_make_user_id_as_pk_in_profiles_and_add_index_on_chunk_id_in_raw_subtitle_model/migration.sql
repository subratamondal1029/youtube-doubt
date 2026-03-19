-- AlterTable
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("userId");

-- DropIndex
DROP INDEX "profiles_userId_key";

-- CreateIndex
CREATE INDEX "raw_subtitles_chunkId_idx" ON "raw_subtitles"("chunkId");
