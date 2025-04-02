-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ALTER COLUMN "approved" DROP NOT NULL,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "difficulty_level" DROP NOT NULL,
ALTER COLUMN "prerequisites" DROP NOT NULL,
ALTER COLUMN "outcomes" DROP NOT NULL,
ALTER COLUMN "dead_line" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" DROP NOT NULL,
ALTER COLUMN "active" DROP NOT NULL,
ALTER COLUMN "clerkuuid" DROP NOT NULL,
ALTER COLUMN "state" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "previous_experience" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "current_skills" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "learning_goals" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "approved" DROP NOT NULL;
