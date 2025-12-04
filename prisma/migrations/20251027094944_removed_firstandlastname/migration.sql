/*
  Warnings:

  - You are about to drop the column `categoryy` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Product` table. All the data in the column will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "categoryy",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
ALTER COLUMN "sizes" DROP NOT NULL,
ALTER COLUMN "sizes" SET DATA TYPE TEXT,
ALTER COLUMN "colors" DROP NOT NULL,
ALTER COLUMN "colors" SET DATA TYPE TEXT,
ALTER COLUMN "tags" DROP NOT NULL,
ALTER COLUMN "tags" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL;
