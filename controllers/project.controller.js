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

export const getProject = async (req, res) => {
  const pageSize = 10;
  const modelName = "project";
  const { clientId } = req.params;
  try {
    const currPage = req.query.page || 1;
    const projects = (
      await paginate(
        currPage,
        pageSize,
        modelName,
        {
          clientId: clientId,
        },
        {
          id: true,
          name: true,
          status: {
            select: {
              status: true,
            },
          },
          status_Detail: true,
        },
      )
    ).items;

    const projectIds = projects.map((project) => project.id);
    console.log(projectIds);

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

    const response = projects.map((project) => {
      project.status = project.status.status;
      if (Object.hasOwn(totalDeliverablesCount, project.id)) {
        project.deliverable = {
          total: totalDeliverablesCount[project.id],
        };
      }
      if (Object.hasOwn(completedDeliverablesCount, project.id)) {
        project.deliverable.completed = totalDeliverablesCount[project.id];
      }
      return project;
    });

    res.status(200).json({ success: true, data: projects });
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
