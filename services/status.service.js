import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getStatus = async (type) => {
  const statusList = await prisma.status.findMany({
    where: {
      statusType: type,
    },
    select: {
      id: true,
      status: true,
    },
  });
  return statusList;
};
