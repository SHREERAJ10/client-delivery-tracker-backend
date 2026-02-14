import { deliverableSchema } from "../models/deliverableModel.js";
import * as deliverableService from "../services/deliverable.service.js";

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