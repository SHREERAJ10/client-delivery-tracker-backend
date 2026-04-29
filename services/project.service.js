import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ log: ["query"] });

export const createProject = async (
  projectName,
  statusId,
  statusDetail,
  due_Date,
  clientId,
) => {
  await prisma.project.create({
    data: {
      name: projectName,
      statusId: statusId,
      status_Detail: statusDetail,
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

export const updateProject = async (
  id,
  projectName,
  statusId,
  statusDetail,
  due_Date,
) => {
  await prisma.project.update({
    where: {
      id: id,
    },
    data: {
      name: projectName,
      statusId: statusId,
      status_Detail: statusDetail,
      due_Date: due_Date,
    },
  });
};

export const projectHealth = async (projectId) => {
  const projectData = await prisma.project.findFirst({
    where: {
      id: projectId,
    },
    select: {
      due_Date: true,
      status: {
        select: {
          status: true,
        },
      },
    },
  });

  const today = new Date();
  const atRiskDate = new Date(today.setDate(today.getDate() + 3));
  let status;

  if (
    projectData.status.status == "Completed" ||
    projectData.status.status == "Cancelled"
  ) {
    status = "Healthy";
  } else if (today > projectData.due_Date) {
    status = "Critical";
  } else if (atRiskDate > projectData.due_Date) {
    status = "At Risk";
  } else if (projectData.status.status == "On Hold") {
    status = "On Hold";
  } else {
    status = "On Track";
  }

  return status;
};

export const searchProject = async (searchQuery) => {
  const projects = await prisma.project.findMany({
    where: {
      name: {
        contains: searchQuery,
        mode: "insensitive",
      },
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
    },
  });

  return projects;
};
