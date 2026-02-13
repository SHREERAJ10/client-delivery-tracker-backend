import * as projectService from "../services/project.service.js";

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
