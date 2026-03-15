import { deliverableSchema } from "../models/deliverableModel.js";
import * as deliverableService from "../services/deliverable.service.js";
import { paginate } from "../utils/paginate.js";

export const createDeliverable = async (req, res) => {
  try {
    const { deliverableName, projectId, statusId, due_Date, note } =
      deliverableSchema.parse(req.body);
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
        id:true,
        name: true,
        due_Date: true,
        status: true,
        note: true,
      },
    );
    res.status(200).json({ success: true, deliverables: deliverables });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "internal server error!" });
  }
};

export const deleteDeliverable = async (req, res) => {
  try {
    const id = req.params.id;
    await deliverableService.deleteDeliverable(id);
    res
      .status(200)
      .json({ success: true, message: "Deliverable Deleted Successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "internal server error!" });
  }
};

export const updateDeliverable = async (req, res) => {
  try {
    const id = req.params.id;
    const { deliverableName, statusId, due_Date, note } =
      deliverableSchema.parse(req.body);
    await deliverableService.updateDeliverable(
      id,
      deliverableName,
      statusId,
      due_Date,
      note,
    );
    res
      .status(200)
      .json({ success: true, message: "Deliverable Updated Successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "internal server error!" });
  }
};
