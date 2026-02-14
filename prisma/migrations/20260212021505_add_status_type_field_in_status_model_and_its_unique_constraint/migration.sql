/*
  Warnings:

  - A unique constraint covering the columns `[status,statusType]` on the table `Status` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `statusType` to the `Status` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "statusType" AS ENUM ('PROJECT', 'DELIVERABLE');

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_clientId_fkey";

-- AlterTable
ALTER TABLE "Status" ADD COLUMN     "statusType" "statusType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Status_status_statusType_key" ON "Status"("status", "statusType");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
