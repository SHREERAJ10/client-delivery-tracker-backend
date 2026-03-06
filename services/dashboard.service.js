import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTotalClients = async () => {
  const totalClients = await prisma.client.count();
  const result = {
    label: "Total Clients",
    name: "totalClients",
    count: totalClients,
  };
  return result;
};

export const getActiveProjects = async () => {
  const activeProjects = await prisma.project.count({
    where: {
      status: {
          status: "Active",
          statusType: "PROJECT",
      },
    },
  });

  const result = {
    label: "Active Projects",
    name: "activeProjects",
    count: activeProjects,
  };
  return result;
};
