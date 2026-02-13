import * as projectService from "../services/project.service.js";
import { paginate } from "../utils/paginate.js";

export const createProject = async (req, res) => {
  try {
    const { projectName, clientId, statusId, due_Date } = req.body;
    await projectService.createProject(
      projectName,
      statusId,
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
  console.log(clientId);
  try {
    const currPage = req.query.page || 1;
    const projects = await paginate(
      currPage,
      pageSize,
      modelName,
      {
        clientId: clientId,
      },
      { 
        status:true,
      },
    );
    res.status(200).json({ success: true, projects: projects });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "internal server error!" });
  }
};
