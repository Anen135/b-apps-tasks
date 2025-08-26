/*
  Warnings:

  - The values [ALL] on the enum `NewsCategory` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `readTime` on the `News` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NewsCategory_new" AS ENUM ('GLOBAL', 'DESIGN', 'PREVIEW');
ALTER TABLE "News" ALTER COLUMN "category" DROP DEFAULT;
ALTER TABLE "News" ALTER COLUMN "category" TYPE "NewsCategory_new" USING ("category"::text::"NewsCategory_new");
ALTER TYPE "NewsCategory" RENAME TO "NewsCategory_old";
ALTER TYPE "NewsCategory_new" RENAME TO "NewsCategory";
DROP TYPE "NewsCategory_old";
ALTER TABLE "News" ALTER COLUMN "category" SET DEFAULT 'GLOBAL';
COMMIT;

-- AlterTable
ALTER TABLE "News" DROP COLUMN "readTime",
ALTER COLUMN "category" DROP NOT NULL,
ALTER COLUMN "category" SET DEFAULT 'GLOBAL';
