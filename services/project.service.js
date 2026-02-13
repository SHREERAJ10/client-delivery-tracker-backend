import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createProject = async (
  projectName,
  statusId,
  due_Date,
  clientId,
) => {
  await prisma.project.create({
    data: {
      name: projectName,
      statusId: statusId,
      due_Date: due_Date,
      clientId: clientId,
    },
  });
};
