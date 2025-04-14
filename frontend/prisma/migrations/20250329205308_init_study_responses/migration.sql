-- CreateTable
CREATE TABLE "StudyResponse" (
    "id" TEXT NOT NULL,
    "subtopic" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "examples" TEXT,
    "analogy" TEXT,
    "codeExample" TEXT,
    "keywords" TEXT[],
    "summary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudyResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudyResponse_subtopic_key" ON "StudyResponse"("subtopic");
