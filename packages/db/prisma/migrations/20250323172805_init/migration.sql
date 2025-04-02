-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'mentor', 'member', 'ta');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('assigned', 'submitted', 'reassigned', 'completed');

-- CreateEnum
CREATE TYPE "DifficultyLevel" AS ENUM ('easy', 'medium', 'moderate', 'hard');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'member',
    "active" BOOLEAN NOT NULL,
    "banned" BOOLEAN NOT NULL,
    "clerkuuid" TEXT NOT NULL,
    "college_name" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "previous_experience" TEXT[],
    "current_skills" TEXT[],
    "learning_goals" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty_level" "DifficultyLevel" NOT NULL,
    "reassigned" INTEGER NOT NULL DEFAULT 0,
    "prerequisites" TEXT NOT NULL,
    "outcomes" TEXT NOT NULL,
    "dead_line" TIMESTAMP(3) NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'assigned',

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
