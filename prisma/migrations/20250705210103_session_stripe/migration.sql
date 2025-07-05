/*
  Warnings:

  - Made the column `stripeSessionId` on table `payments` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "stripePaymentId" DROP NOT NULL,
ALTER COLUMN "stripeSessionId" SET NOT NULL;
