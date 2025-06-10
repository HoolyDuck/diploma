/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `Version` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fileId]` on the table `Version` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fileId` to the `Version` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Version_fileUrl_key";

-- AlterTable
ALTER TABLE "Version" DROP COLUMN "fileUrl",
ADD COLUMN     "fileId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Version_fileId_key" ON "Version"("fileId");
