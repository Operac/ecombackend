/*
  Warnings:

  - You are about to drop the `Receipt` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReceiptItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ReceiptItem" DROP CONSTRAINT "ReceiptItem_ProductId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ReceiptItem" DROP CONSTRAINT "ReceiptItem_receiptId_fkey";

-- DropTable
DROP TABLE "public"."Receipt";

-- DropTable
DROP TABLE "public"."ReceiptItem";
