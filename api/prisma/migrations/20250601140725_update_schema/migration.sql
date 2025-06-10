/*
  Warnings:

  - You are about to drop the column `appId` on the `AppMedia` table. All the data in the column will be lost.
  - You are about to drop the column `mediaUrl` on the `AppMedia` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `AppMedia` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `developerId` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `appId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `isModerated` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the `AppVersion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Report` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[applicationId,mediaId]` on the table `AppMedia` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[activeVersionId]` on the table `Application` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[categoryName]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `applicationId` to the `AppMedia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mediaId` to the `AppMedia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `activeVersionId` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Made the column `iconMediaId` on table `Application` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `categoryName` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `applicationId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `userId` on the `Review` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ApplicationType" AS ENUM ('WEB', 'DESKTOP');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'IN_REVIEW', 'REJECTED', 'HIDDEN');

-- CreateEnum
CREATE TYPE "VersionStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'PUBLISHED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "AppMedia" DROP CONSTRAINT "AppMedia_appId_fkey";

-- DropForeignKey
ALTER TABLE "AppVersion" DROP CONSTRAINT "AppVersion_appId_fkey";

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_iconMediaId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_reviewId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_appId_fkey";

-- DropIndex
DROP INDEX "Application_iconMediaId_key";

-- DropIndex
DROP INDEX "Category_name_key";

-- AlterTable
ALTER TABLE "AppMedia" DROP COLUMN "appId",
DROP COLUMN "mediaUrl",
DROP COLUMN "type",
ADD COLUMN     "applicationId" INTEGER NOT NULL,
ADD COLUMN     "mediaId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "categoryId",
DROP COLUMN "developerId",
DROP COLUMN "isActive",
ADD COLUMN     "activeVersionId" INTEGER NOT NULL,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "status" "ApplicationStatus" NOT NULL,
ADD COLUMN     "type" "ApplicationType" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD COLUMN     "websiteUrl" TEXT,
ALTER COLUMN "iconMediaId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "name",
ADD COLUMN     "categoryName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "appId",
DROP COLUMN "isModerated",
ADD COLUMN     "applicationId" INTEGER NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "comment" DROP NOT NULL;

-- DropTable
DROP TABLE "AppVersion";

-- DropTable
DROP TABLE "Report";

-- DropEnum
DROP TYPE "MediaType";

-- CreateTable
CREATE TABLE "Media" (
    "id" SERIAL NOT NULL,
    "mediaUrl" TEXT NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Version" (
    "id" SERIAL NOT NULL,
    "applicationId" INTEGER NOT NULL,
    "versionName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "status" "VersionStatus" NOT NULL,

    CONSTRAINT "Version_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewReport" (
    "id" SERIAL NOT NULL,
    "reviewId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationReport" (
    "id" SERIAL NOT NULL,
    "applicationId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApplicationReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppCategory" (
    "id" SERIAL NOT NULL,
    "applicationId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "AppCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Media_mediaUrl_key" ON "Media"("mediaUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Version_fileUrl_key" ON "Version"("fileUrl");

-- CreateIndex
CREATE UNIQUE INDEX "AppCategory_applicationId_categoryId_key" ON "AppCategory"("applicationId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "AppMedia_applicationId_mediaId_key" ON "AppMedia"("applicationId", "mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "Application_activeVersionId_key" ON "Application"("activeVersionId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_categoryName_key" ON "Category"("categoryName");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_activeVersionId_fkey" FOREIGN KEY ("activeVersionId") REFERENCES "Version"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_iconMediaId_fkey" FOREIGN KEY ("iconMediaId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Version" ADD CONSTRAINT "Version_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewReport" ADD CONSTRAINT "ReviewReport_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationReport" ADD CONSTRAINT "ApplicationReport_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppCategory" ADD CONSTRAINT "AppCategory_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppCategory" ADD CONSTRAINT "AppCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppMedia" ADD CONSTRAINT "AppMedia_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppMedia" ADD CONSTRAINT "AppMedia_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
