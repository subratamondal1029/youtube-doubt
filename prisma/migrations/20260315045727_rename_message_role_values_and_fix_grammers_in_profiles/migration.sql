/*
  Warnings:

  - The values [AI] on the enum `MESSAGE_ROLE` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `personalize` on the `profiles` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MESSAGE_ROLE_new" AS ENUM ('USER', 'ASSISTANT');
ALTER TABLE "messages" ALTER COLUMN "role" TYPE "MESSAGE_ROLE_new" USING ("role"::text::"MESSAGE_ROLE_new");
ALTER TYPE "MESSAGE_ROLE" RENAME TO "MESSAGE_ROLE_old";
ALTER TYPE "MESSAGE_ROLE_new" RENAME TO "MESSAGE_ROLE";
DROP TYPE "public"."MESSAGE_ROLE_old";
COMMIT;

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "personalize",
ADD COLUMN     "personalization" TEXT;
