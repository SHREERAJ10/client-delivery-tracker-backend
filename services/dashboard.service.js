import { PrismaClient } from "@prisma/client";
import { paginate } from "../utils/paginate.js";

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

export const getOverdueDeliverbles = async (currPage, pageSize) => {
  const today = new Date();

  const overdueDeliverables = (
    await paginate(
      currPage,
      pageSize,
      "deliverable",
      {
        due_Date: {
          lt: today,
        },
        status: {
          status: {
            not: "Delivered",
          },
        },
      },
      {
        name: true,
        due_Date: true,
        status: {
          select: {
            status: true,
          },
        },
        project: {
          select: {
            name: true,
            client: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    )
  ).items;

  const response = overdueDeliverables.map((deliverable) => {
    return {
      name: deliverable.name,
      status: deliverable.status.status,
      due_Date: deliverable.due_Date,
      projectName: deliverable.project.name,
      clientName: deliverable.project.client.name,
    };
  });

  return response;
};

export const getUpcomingDeliverables = async (currPage) => {
  const currDate = new Date();
  const today = new Date();
  const lastDate = new Date(currDate.setDate(today.getDate() + 7));

  const upcomingDeliverables = (
    await paginate(
      currPage,
      5,
      "deliverable",
      {
        due_Date: {
          gte: today,
          lte: lastDate,
        },
        status: {
          status: {
            not: "Delivered",
          },
        },
      },
      {
        name: true,
        due_Date: true,
        status: {
          select: {
            status: true,
          },
        },
        project: {
          select: {
            name: true,
            client: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    )
  ).items;

  const response = upcomingDeliverables.map((deliverable) => {
    return {
      name: deliverable.name,
      status: deliverable.status.status,
      due_Date: deliverable.due_Date,
      projectName: deliverable.project.name,
      clientName: deliverable.project.client.name,
    };
  });

  return response;
};

export const getPendingDeliverables = async () => {
  return await prisma.deliverable.count({
    where: {
      status: {
        status: "In Review",
      },
    },
  });
};
