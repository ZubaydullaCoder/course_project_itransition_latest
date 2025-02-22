-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "description" TEXT,
ADD COLUMN     "showInResults" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "FormResponse" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "formResponseId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FormResponse_templateId_idx" ON "FormResponse"("templateId");

-- CreateIndex
CREATE INDEX "FormResponse_userId_idx" ON "FormResponse"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "FormResponse_templateId_userId_key" ON "FormResponse"("templateId", "userId");

-- CreateIndex
CREATE INDEX "Answer_questionId_idx" ON "Answer"("questionId");

-- CreateIndex
CREATE INDEX "Answer_formResponseId_idx" ON "Answer"("formResponseId");

-- AddForeignKey
ALTER TABLE "FormResponse" ADD CONSTRAINT "FormResponse_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponse" ADD CONSTRAINT "FormResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_formResponseId_fkey" FOREIGN KEY ("formResponseId") REFERENCES "FormResponse"("id") ON DELETE CASCADE ON UPDATE CASCADE;
