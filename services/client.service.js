import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createClient = async (clientName) => {
  await prisma.client.create({
    data: { name: clientName },
  });
};

export const updateClient = async (clientName, id) => {
  await prisma.client.update({
    where: {
      id: id,
    },
    data: { name: clientName },
  });
};
