import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createDeliverable = async (
  deliverableName,
  statusId,
  due_Date,
  note,
  projectId,
) => {
  await prisma.deliverable.create({
    data: {
      name: deliverableName,
      statusId: statusId,
      due_Date: due_Date,
      note: note,
      projectId: projectId,
    },
  });
};