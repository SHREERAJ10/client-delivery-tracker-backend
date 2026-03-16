/*
  Warnings:

  - You are about to drop the `_ProjectToStatus` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProjectToStatus" DROP CONSTRAINT "_ProjectToStatus_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectToStatus" DROP CONSTRAINT "_ProjectToStatus_B_fkey";

-- DropTable
DROP TABLE "_ProjectToStatus";

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
