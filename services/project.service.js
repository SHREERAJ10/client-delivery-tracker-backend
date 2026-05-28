import { prisma } from "../db.js";

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
  let status;

  if (
    projectData.status.status == "Completed" ||
    projectData.status.status == "Cancelled"
  ) {
    status = "Healthy";
  } else if (projectData.status.status == "On Hold") {
    status = "On Hold";
  } else if (
    projectData.due_Date.getDate() - today.getDate() <= 3 &&
    projectData.due_Date.getDate() - today.getDate() >= 0
  ) {
    status = "At Risk";
  } else if (today > projectData.due_Date) {
    status = "Critical";
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

export const getProjects = async () => {
  const projects = await prisma.project.findMany({
    select: {
      id: true,
      name: true,
      clientId: true,
    },
  });
  return projects;
};

export const getProject = async (id) => {
  const project = await prisma.project.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      clientId: true,
    },
  });
  return project;
};
