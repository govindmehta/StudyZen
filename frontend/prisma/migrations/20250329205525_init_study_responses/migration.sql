-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_flashCardId_fkey";

-- DropForeignKey
ALTER TABLE "FlashCard" DROP CONSTRAINT "FlashCard_userId_fkey";

-- AlterTable
ALTER TABLE "FlashCard" ALTER COLUMN "lastStudied" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "StudyResponse" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "FlashCard" ADD CONSTRAINT "FlashCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_flashCardId_fkey" FOREIGN KEY ("flashCardId") REFERENCES "FlashCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyResponse" ADD CONSTRAINT "StudyResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
