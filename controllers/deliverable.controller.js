import { deliverableSchema } from "../models/deliverableModel.js";
import * as deliverableService from "../services/deliverable.service.js";
import { projectHealth } from "../services/project.service.js";
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
  try {
    const pageSize = 5;
    const modelName = "deliverable";
    const { projectId } = req.params;
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
    const currPage = req.query.page || 1;
    const deliverables = await paginate(
      currPage,
      pageSize,
      modelName,
      {
        projectId: projectId,
        ...search,
        ...(statusFilter && { status: { status: statusFilter } }),
      },
      {
        id: true,
        name: true,
        due_Date: true,
        status: true,
        note: true,
      },
    );
    res.status(200).json({ success: true, data: deliverables });
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

export const getDeliverableStatus = async (req, res) => {
  try {
    const { projectId } = req.params;
    const totalDeliverables = await deliverableService.deliverableCount({
      projectId: projectId,
    });
    const completedDeliverables = await deliverableService.deliverableCount({
      projectId: projectId,
      status: {
        status: "Delivered",
      },
    });

    const projectHealthData = await projectHealth(projectId);

    const projectMetadata = [
      {
        label: "Total Deliverables",
        key: "totalDeliverables",
        value: totalDeliverables,
      },
      {
        label: "Completed",
        key: "completed",
        value: completedDeliverables,
      },
      {
        label: "Project Health",
        key: "projectHealth",
        value: projectHealthData,
      },
    ];

    res.status(200).json({ success: true, data: projectMetadata });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "internal server error!" });
  }
};
