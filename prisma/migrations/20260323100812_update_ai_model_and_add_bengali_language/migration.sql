/*
  Warnings:

  - The values [SARVAM_M] on the enum `AI_MODEL` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AI_MODEL_new" AS ENUM ('SARVAM_30B');
ALTER TABLE "public"."chats" ALTER COLUMN "model" DROP DEFAULT;
ALTER TABLE "public"."system_instructions" ALTER COLUMN "model" DROP DEFAULT;
ALTER TABLE "chats" ALTER COLUMN "model" TYPE "AI_MODEL_new" USING ("model"::text::"AI_MODEL_new");
ALTER TABLE "system_instructions" ALTER COLUMN "model" TYPE "AI_MODEL_new" USING ("model"::text::"AI_MODEL_new");
ALTER TYPE "AI_MODEL" RENAME TO "AI_MODEL_old";
ALTER TYPE "AI_MODEL_new" RENAME TO "AI_MODEL";
DROP TYPE "public"."AI_MODEL_old";
ALTER TABLE "chats" ALTER COLUMN "model" SET DEFAULT 'SARVAM_30B';
ALTER TABLE "system_instructions" ALTER COLUMN "model" SET DEFAULT 'SARVAM_30B';
COMMIT;

-- AlterEnum
ALTER TYPE "CHAT_LANGUAGE" ADD VALUE 'BENGALI';

-- AlterTable
ALTER TABLE "chats" ALTER COLUMN "model" SET DEFAULT 'SARVAM_30B';

-- AlterTable
ALTER TABLE "system_instructions" ALTER COLUMN "model" SET DEFAULT 'SARVAM_30B';
