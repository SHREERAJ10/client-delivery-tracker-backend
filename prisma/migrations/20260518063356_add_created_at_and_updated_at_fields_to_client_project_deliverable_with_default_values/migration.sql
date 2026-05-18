-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT NOW() - (random() * (NOW() - '2025-01-01'::timestamp)),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW() - (random() * (NOW() - '2025-01-01'::timestamp));

-- AlterTable
ALTER TABLE "Deliverable" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT NOW() - (random() * (NOW() - '2025-01-01'::timestamp)),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW() - (random() * (NOW() - '2025-01-01'::timestamp));

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT NOW() - (random() * (NOW() - '2025-01-01'::timestamp)),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW() - (random() * (NOW() - '2025-01-01'::timestamp));
