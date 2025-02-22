-- CreateTable
CREATE TABLE "AllowedUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AllowedUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AllowedUser_templateId_idx" ON "AllowedUser"("templateId");

-- CreateIndex
CREATE INDEX "AllowedUser_email_idx" ON "AllowedUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AllowedUser_email_templateId_key" ON "AllowedUser"("email", "templateId");

-- AddForeignKey
ALTER TABLE "AllowedUser" ADD CONSTRAINT "AllowedUser_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;
