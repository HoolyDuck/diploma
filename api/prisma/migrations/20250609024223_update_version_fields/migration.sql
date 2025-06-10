-- DropIndex
DROP INDEX "Version_fileId_key";

-- AlterTable
ALTER TABLE "Version" ALTER COLUMN "status" SET DEFAULT 'DRAFT',
ALTER COLUMN "fileId" DROP NOT NULL;
