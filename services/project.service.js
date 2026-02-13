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

export const deleteProject = async (id) => {
  await prisma.project.delete({
    where: {
      id: id,
    },
  });
};

export const updateProject = async (id, projectName, statusId, due_Date) => {
  await prisma.project.update({
    where: {
      id: id,
    },
    data: {
      name: projectName,
      statusId:statusId,
      due_Date:due_Date,
    },
  });
};