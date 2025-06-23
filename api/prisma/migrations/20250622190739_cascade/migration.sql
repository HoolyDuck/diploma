-- DropForeignKey
ALTER TABLE "AppCategory" DROP CONSTRAINT "AppCategory_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "AppDownload" DROP CONSTRAINT "AppDownload_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "AppMedia" DROP CONSTRAINT "AppMedia_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "ApplicationReport" DROP CONSTRAINT "ApplicationReport_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "Version" DROP CONSTRAINT "Version_applicationId_fkey";

-- AddForeignKey
ALTER TABLE "Version" ADD CONSTRAINT "Version_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationReport" ADD CONSTRAINT "ApplicationReport_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppCategory" ADD CONSTRAINT "AppCategory_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppMedia" ADD CONSTRAINT "AppMedia_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppDownload" ADD CONSTRAINT "AppDownload_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
