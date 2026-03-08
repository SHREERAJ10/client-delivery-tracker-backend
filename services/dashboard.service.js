import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTotalClients = async () => {
  const totalClients = await prisma.client.count();
  return totalClients;
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

  return activeProjects;
};

export const getDeliverablesDueThisWeekCount = async () => {
  const currDate = new Date();
  const firstDayOfCurrWeek = currDate.getDate() - currDate.getDay();
  const firstDate = new Date(currDate.setDate(firstDayOfCurrWeek));
  const lastDate = new Date(currDate.setDate(firstDayOfCurrWeek + 6));

  const dueThisWeekCount = await prisma.deliverable.count({
    where: {
      due_Date: {
        gt: firstDate,
        lt: lastDate,
      },
    },
  });

  return dueThisWeekCount;
};

export const getOverdueDeliverablesCount = async () => {
  const today = new Date();

  const overdueDeliverablesCount = await prisma.deliverable.count({
    where: {
      due_Date: {
        lt: today,
      },
    },
  });

  return overdueDeliverablesCount;
};

export const getOverdueDeliverbles = async () => {
  const today = new Date();

  const overdueDeliverables = await prisma.deliverable.findMany({
    where: {
      due_Date: {
        lt: today,
      },
      status:{
        status:{
          not: "Delivered"
        }
      }
    },
    select: {
      name: true,
      due_Date: true,
      status:{
        select:{
          status:true,
        }
      },
      project:{
        select:{
          name:true,
          client:{
            select:{
              name:true,
            }
          }
        }
      },
    },
  });

  return overdueDeliverables;
};
