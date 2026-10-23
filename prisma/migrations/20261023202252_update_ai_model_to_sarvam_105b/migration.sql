/*
  Warnings:

  - The values [SARVAM_30B] on the enum `AI_MODEL` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AI_MODEL_new" AS ENUM ('SARVAM_105B');
ALTER TABLE "public"."chats" ALTER COLUMN "model" DROP DEFAULT;
ALTER TABLE "public"."system_instructions" ALTER COLUMN "model" DROP DEFAULT;
ALTER TABLE "chats" ALTER COLUMN "model" TYPE "AI_MODEL_new" USING (
  CASE "model"::text
    WHEN 'SARVAM_30B' THEN 'SARVAM_105B'::"AI_MODEL_new"
    ELSE 'SARVAM_105B'::"AI_MODEL_new"
  END
);
ALTER TABLE "system_instructions" ALTER COLUMN "model" TYPE "AI_MODEL_new" USING (
  CASE "model"::text
    WHEN 'SARVAM_30B' THEN 'SARVAM_105B'::"AI_MODEL_new"
    ELSE 'SARVAM_105B'::"AI_MODEL_new"
  END
);
ALTER TYPE "AI_MODEL" RENAME TO "AI_MODEL_old";
ALTER TYPE "AI_MODEL_new" RENAME TO "AI_MODEL";
DROP TYPE "public"."AI_MODEL_old";
ALTER TABLE "chats" ALTER COLUMN "model" SET DEFAULT 'SARVAM_105B';
ALTER TABLE "system_instructions" ALTER COLUMN "model" SET DEFAULT 'SARVAM_105B';
COMMIT;

-- AlterTable
ALTER TABLE "chats" ALTER COLUMN "model" SET DEFAULT 'SARVAM_105B';

-- AlterTable
ALTER TABLE "system_instructions" ALTER COLUMN "model" SET DEFAULT 'SARVAM_105B';
