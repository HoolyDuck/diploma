-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_activeVersionId_fkey";

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_iconMediaId_fkey";

-- AlterTable
ALTER TABLE "Application" ALTER COLUMN "iconMediaId" DROP NOT NULL,
ALTER COLUMN "activeVersionId" DROP NOT NULL,
ALTER COLUMN "status" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_activeVersionId_fkey" FOREIGN KEY ("activeVersionId") REFERENCES "Version"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_iconMediaId_fkey" FOREIGN KEY ("iconMediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
