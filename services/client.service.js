import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient()

export const createClient = async (clientName) => {
  await prisma.client.create({
    data: { name: clientName },
  });
};