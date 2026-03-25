/*
  Warnings:

  - A unique constraint covering the columns `[model,language]` on the table `system_instructions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "system_instructions_model_language_key" ON "system_instructions"("model", "language");
