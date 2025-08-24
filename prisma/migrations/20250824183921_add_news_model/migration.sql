-- CreateEnum
CREATE TYPE "NewsCategory" AS ENUM ('ALL', 'GLOBAL', 'DESIGN', 'PREVIEW');

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "avatarUrl" SET DEFAULT '/unset_avatar.png';

-- CreateTable
CREATE TABLE "News" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "excerpt" TEXT NOT NULL,
    "cover" TEXT,
    "readTime" INTEGER,
    "trending" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[],
    "category" "NewsCategory" NOT NULL DEFAULT 'ALL',
    "authorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "News_slug_key" ON "News"("slug");

-- CreateIndex
CREATE INDEX "News_trending_idx" ON "News"("trending");

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
