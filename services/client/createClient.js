import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient()

const createClient = async (clientName) => {
  await prisma.client.create({
    data: { name: clientName },
  });
};

export default createClient;