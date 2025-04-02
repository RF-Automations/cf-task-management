-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'moderator';

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "approved" SET DEFAULT false;
