import { projectSchema } from "../models/projectModel.js";
import * as projectService from "../services/project.service.js";
import { paginate } from "../utils/paginate.js";
import { groupByAndCount } from "./client.controller.js";

export const createProject = async (req, res) => {
  try {
    const { projectName, clientId, statusId, statusDetail, due_Date } =
      projectSchema.parse(req.body);
    await projectService.createProject(
      projectName,
      statusId,
      statusDetail,
      due_Date,
      clientId,
    );
    res
      .status(200)
      .json({ success: true, message: "Project Created Successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "internal server error!" });
  }
};

export const getProjectDetails = async (req, res) => {
  const pageSize = 5;
  const modelName = "project";
  const { clientId } = req.params;
  const searchQuery = req.query.searchQuery;
  const statusFilter = req.query.status;

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
            status: {
              status: {
                contains: searchQuery,
                mode: "insensitive",
              },
            },
          },
        ],
      }
    : {};

  try {
    const currPage = Number(req.query.page || 1);
    const projectData = await paginate(
      currPage,
      pageSize,
      modelName,
      {
        clientId: clientId,
        ...search,
        ...(statusFilter && { status: { status: statusFilter } }),
      },
      {
        id: true,
        name: true,
        due_Date: true,
        status: {
          select: {
            status: true,
            id: true,
          },
        },
        status_Detail: true,
      },
    );

    const projects = projectData.items;

    const projectIds = projects.map((project) => project.id);

    const totalDeliverablesArr = await groupByAndCount(
      "deliverable",
      ["projectId"],
      {
        projectId: { in: projectIds },
      },
    );

    const totalDeliverablesCount = {};
    for (let deliverable of totalDeliverablesArr) {
      totalDeliverablesCount[deliverable.projectId] = deliverable._count.id;
    }

    const completedDeliverablesArr = await groupByAndCount(
      "deliverable",
      ["projectId", "statusId"],
      {
        projectId: { in: projectIds },
        status: {
          status: "Delivered",
        },
      },
    );

    const completedDeliverablesCount = {};
    for (let deliverable of completedDeliverablesArr) {
      completedDeliverablesCount[deliverable.projectId] = deliverable._count.id;
    }

    projectData.items = projects.map((project) => {
      if (Object.hasOwn(totalDeliverablesCount, project.id)) {
        project.deliverable = {
          total: totalDeliverablesCount[project.id],
        };
      } else {
        project.deliverable = {
          total: 0,
        };
      }
      if (Object.hasOwn(completedDeliverablesCount, project.id)) {
        project.deliverable.completed = completedDeliverablesCount[project.id];
      } else {
        project.deliverable.completed = 0;
      }
      return project;
    });

    res.status(200).json({ success: true, data: projectData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "internal server error!" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const id = req.params.id;
    await projectService.deleteProject(id);
    res
      .status(200)
      .json({ success: true, message: "Project Deleted Successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "internal server error!" });
  }
};

export const updateProject = async (req, res) => {
  try {
    const id = req.params.id;
    const { projectName, statusId, statusDetail, due_Date } =
      projectSchema.parse(req.body);
    await projectService.updateProject(
      id,
      projectName,
      statusId,
      statusDetail,
      due_Date,
    );
    res
      .status(200)
      .json({ success: true, message: "Project Updated Successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "internal server error!" });
  }
};

export const searchProject = async (req, res) => {
  try {
    const searchQuery = req.query.searchQuery || "";
    const results = await projectService.searchProject(
      String(searchQuery.trim()),
    );
    res.status(200).json({ success: true, data: results });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "internal server error!" });
  }
};

export const getProjects = async (req, res) => {
  const projects = await projectService.getProjects();
  res.status(200).json({ success: true, data: projects });
};

export const getProject = async (req, res) => {
  const { id } = req.params;
  const project = await projectService.getProject(id);
  res.status(200).json({ success: true, data: project });
};
