-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);
