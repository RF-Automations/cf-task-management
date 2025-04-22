-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('submitted', 'reassigned', 'completed');

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "status" "SubmissionStatus";
