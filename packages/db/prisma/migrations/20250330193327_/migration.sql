-- AlterTable
ALTER TABLE "User" ADD COLUMN     "onboarding" BOOLEAN DEFAULT false;

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "github" TEXT NOT NULL,
    "source_link" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
