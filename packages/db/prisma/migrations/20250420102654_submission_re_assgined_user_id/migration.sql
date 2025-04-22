-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "reAssignedUserId" TEXT;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_reAssignedUserId_fkey" FOREIGN KEY ("reAssignedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
