import { Prisma } from "@prisma/client";
import { clientSchema } from "../models/clientModel.js";
import * as clientService from "../services/client.service.js";
import { paginate } from "../utils/paginate.js";
import {
  getActiveProjects,
  getOverdueDeliverablesCount,
  getPendingDeliverables,
} from "../services/dashboard.service.js";
import { prisma } from "../db.js";

export const groupByAndCount = async (model, by, where) => {
  return await prisma[model].groupBy({
    by: by,
    where: where,
    _count: {
      id: true,
    },
  });
};

const deliverableCountPerClient = async (projects, where) => {
  const deliverableCountPerProject = await groupByAndCount(
    "deliverable",
    "projectId",
    where,
  );

  const projectToClientMap = {};
  let clientToDeliverableCountMap = {};

  for (let project of projects) {
    projectToClientMap[project.id] = project.clientId;
  }

  for (let deliverable of deliverableCountPerProject) {
    if (Object.keys(projectToClientMap).includes(deliverable.projectId)) {
      const clientId = projectToClientMap[deliverable.projectId];
      if (Object.hasOwn(clientToDeliverableCountMap, clientId)) {
        clientToDeliverableCountMap[clientId] += deliverable._count.id;
      } else {
        clientToDeliverableCountMap[clientId] = deliverable._count.id;
      }
    }
  }

  return clientToDeliverableCountMap;
};

export const getClients = async (req, res) => {
  try {
    const clients = await clientService.getClients();
    res.status(200).json({ success: true, data: clients });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "internal server error!" });
  }
};

export const getClient = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await clientService.getClient(id);
    res.status(200).json({ success: true, data: client });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "internal server error!" });
  }
};

export const getClientOverview = async (req, res) => {
  try {
    const searchQuery = req.query.searchQuery;
    const pageSize = 5;
    const modelName = "client";

    const search = searchQuery
      ? {
          OR: [
            {
              name: {
                contains: searchQuery,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: searchQuery,
                mode: "insensitive",
              },
            },
          ],
        }
      : {};
    const currPage = req.query.page || 1;

    const clientsData = await paginate(currPage, pageSize, modelName, search, {
      id: true,
      name: true,
      email: true,
    });

    const clients = clientsData.items;

    const clientIds = clients.map((c) => c.id); //array of ids of clients, paginated

    const projects = await prisma.project.findMany({
      where: {
        clientId: { in: clientIds },
      },
      select: {
        id: true,
        clientId: true,
      },
    });

    const projectIds = projects.map((p) => p.id);

    const activeProjectArray = await groupByAndCount("project", "clientId", {
      status: {
        status: "Active",
      },
      clientId: { in: clientIds },
    });

    const activeProjectCount = {};

    for (let project of activeProjectArray) {
      activeProjectCount[project.clientId] = project._count.id;
    }

    const overdueDeliverableCount = await deliverableCountPerClient(projects, {
      due_Date: {
        lt: new Date(),
      },
    });

    const openDeliverableCount = await deliverableCountPerClient(projects, {
      status: {
        status: {
          not: "Delivered",
        },
      },
      projectId: { in: projectIds },
    });

    clientsData.items = clients.map((client) => {
      if (Object.hasOwn(activeProjectCount, client.id)) {
        client.project = {
          active: activeProjectCount[client.id],
        };
      } else {
        client.project = {
          active: 0,
        };
      }
      if (Object.hasOwn(overdueDeliverableCount, client.id)) {
        client.deliverable = {
          overdue: overdueDeliverableCount[client.id],
        };
      } else {
        client.deliverable = {
          overdue: 0,
        };
      }
      if (Object.hasOwn(openDeliverableCount, client.id)) {
        client.deliverable.open = openDeliverableCount[client.id];
      } else {
        client.deliverable.open = 0;
      }
      return client;
    });

    res.status(200).json({ success: true, data: clientsData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "internal server error!" });
  }
};

export const createClient = async (req, res) => {
  try {
    const { clientName, email } = clientSchema.parse(req.body);
    await clientService.createClient(clientName, email);
    res
      .status(200)
      .json({ success: true, message: "Client Created Successfully!" });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code == "P2002") {
        res.status(409).json({
          success: false,
          error: "A client with this email already exists.",
        });
      }
    } else {
      res.status(500).json({ success: false, error: "internal server error!" });
    }
  }
};

export const updateClient = async (req, res) => {
  try {
    const id = req.params.id;
    const { clientName, email } = clientSchema.parse(req.body);
    await clientService.updateClient(id, clientName, email);
    res
      .status(200)
      .json({ success: true, message: "Client Updated Successfully!" });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code == "P2002") {
        res.status(409).json({
          success: false,
          error: "A client with this email already exists.",
        });
      }
    } else {
      res.status(500).json({ success: false, error: "internal server error!" });
    }
  }
};

export const deleteClient = async (req, res) => {
  try {
    const id = req.params.id;
    await clientService.deleteClient(id);
    res
      .status(200)
      .json({ success: true, message: "Client Deleted Successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "internal server error!" });
  }
};

export const getProjectsStats = async (req, res) => {
  try {
    const activeProjects = await getActiveProjects();
    const overdueDeliverables = await getOverdueDeliverablesCount();
    const pendingDeliverables = await getPendingDeliverables();

    const projectStats = [
      {
        label: "Total Projects",
        key: "totalActiveProjects",
        value: activeProjects,
        status: "Active",
      },
      {
        label: "Deliverables",
        key: "pendingDeliverables",
        value: pendingDeliverables,
        status: "Pending",
      },
      {
        label: "Immediate Attention",
        key: "overdueDeliverables",
        value: overdueDeliverables,
        status: "Overdue",
      },
    ];

    res.status(200).json({ success: true, data: projectStats });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "internal server error!" });
  }
};
