/*
  Warnings:

  - The primary key for the `ProductCart` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[ProductId,CartId]` on the table `ProductCart` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ProductCart" DROP CONSTRAINT "ProductCart_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "ProductCart_ProductId_CartId_key" ON "ProductCart"("ProductId", "CartId");
