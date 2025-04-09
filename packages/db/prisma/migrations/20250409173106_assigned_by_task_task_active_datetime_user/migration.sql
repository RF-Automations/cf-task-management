/*
  Warnings:

  - The `active` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "assignedBy" TEXT,
ALTER COLUMN "status" SET DEFAULT 'inprogress';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "active",
ADD COLUMN     "active" TIMESTAMP(3);
