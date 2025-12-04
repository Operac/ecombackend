/*
  Warnings:

  - You are about to drop the `Userproduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Userproduct" DROP CONSTRAINT "Userproduct_productid_fkey";

-- DropForeignKey
ALTER TABLE "public"."Userproduct" DROP CONSTRAINT "Userproduct_userid_fkey";

-- DropTable
DROP TABLE "public"."Userproduct";

-- CreateTable
CREATE TABLE "Cart" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductCart" (
    "ProductId" INTEGER NOT NULL,
    "CartId" INTEGER NOT NULL,

    CONSTRAINT "ProductCart_pkey" PRIMARY KEY ("ProductId","CartId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cart_userId_key" ON "Cart"("userId");

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCart" ADD CONSTRAINT "ProductCart_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCart" ADD CONSTRAINT "ProductCart_CartId_fkey" FOREIGN KEY ("CartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;
