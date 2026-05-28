import { prisma } from "../db.js";

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

export const deleteDeliverable = async (id) => {
  await prisma.deliverable.delete({
    where: {
      id: id,
    },
  });
};

export const updateDeliverable = async (
  id,
  deliverableName,
  statusId,
  due_Date,
  note,
) => {
  await prisma.deliverable.update({
    where: {
      id: id,
    },
    data: {
      name: deliverableName,
      statusId: statusId,
      due_Date: due_Date,
      note: note,
    },
  });
};

export const deliverableCount = async (where) => {
  return await prisma.deliverable.count({
    where: where || {}
  });
};
