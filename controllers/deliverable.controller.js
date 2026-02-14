import { deliverableSchema } from "../models/deliverableModel.js";
import * as deliverableService from "../services/deliverable.service.js";
import { paginate } from "../utils/paginate.js";

export const createDeliverable = async (req, res) => {
  try {
    const { deliverableName, projectId, statusId, due_Date, note } = deliverableSchema.parse(req.body);
    await deliverableService.createDeliverable(
      deliverableName,
      statusId,
      due_Date,
      note,
      projectId,
    );
    res
      .status(200)
      .json({ success: true, message: "Deliverable Created Successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "internal server error!" });
  }
};

export const getDeliverable = async (req, res) => {
  const pageSize = 10;
  const modelName = "deliverable";
  const { projectId } = req.params;
  try {
    const currPage = req.query.page || 1;
    const deliverables = await paginate(
      currPage,
      pageSize,
      modelName,
      {
        projectId: projectId,
      },
      {
        status: true,
      },
    );
    res.status(200).json({ success: true, deliverables: deliverables });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "internal server error!" });
  }
};