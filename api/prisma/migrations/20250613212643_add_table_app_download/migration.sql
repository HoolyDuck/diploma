-- CreateTable
CREATE TABLE "AppDownload" (
    "id" SERIAL NOT NULL,
    "applicationId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "AppDownload_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppDownload_applicationId_userId_key" ON "AppDownload"("applicationId", "userId");

-- AddForeignKey
ALTER TABLE "AppDownload" ADD CONSTRAINT "AppDownload_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
