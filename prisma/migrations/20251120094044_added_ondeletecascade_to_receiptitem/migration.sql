-- DropForeignKey
ALTER TABLE "public"."ReceiptItem" DROP CONSTRAINT "ReceiptItem_ProductId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ReceiptItem" DROP CONSTRAINT "ReceiptItem_receiptId_fkey";

-- AddForeignKey
ALTER TABLE "ReceiptItem" ADD CONSTRAINT "ReceiptItem_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "Receipt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceiptItem" ADD CONSTRAINT "ReceiptItem_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
