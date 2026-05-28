import { prisma } from "../db.js";

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
