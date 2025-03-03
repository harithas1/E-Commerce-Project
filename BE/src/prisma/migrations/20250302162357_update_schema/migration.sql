/*
  Warnings:

  - You are about to drop the column `title` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Shipment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Shipment" DROP CONSTRAINT "Shipment_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Shipment" DROP CONSTRAINT "Shipment_userId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "title";

-- DropTable
DROP TABLE "Payment";

-- DropTable
DROP TABLE "Shipment";

-- DropEnum
DROP TYPE "PaymentStatus";

-- DropEnum
DROP TYPE "ShipmentStatus";
