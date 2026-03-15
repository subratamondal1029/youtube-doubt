-- DropForeignKey
ALTER TABLE "raw_subtitles" DROP CONSTRAINT "raw_subtitles_chunkId_fkey";

-- AddForeignKey
ALTER TABLE "raw_subtitles" ADD CONSTRAINT "raw_subtitles_chunkId_fkey" FOREIGN KEY ("chunkId") REFERENCES "chunk_subtitles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
