import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createClient = async (clientName, email) => {
  await prisma.client.create({
    data: {
      name: clientName,
      email: email,
    },
  });
};

export const updateClient = async (id, clientName, email) => {
  await prisma.client.update({
    where: {
      id: id,
    },
    data: {
      name: clientName,
      email: email,
    },
  });
};

export const deleteClient = async (id) => {
  await prisma.client.delete({
    where: {
      id: id,
    },
  });
};

export const getClients = async () => {
   const clients = await prisma.client.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  return clients;
};