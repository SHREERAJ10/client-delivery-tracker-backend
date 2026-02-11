import { Prisma } from "@prisma/client";
import { clientSchema } from "../models/clientModel.js";
import * as clientService from "../services/client.service.js";
import { paginate } from "../utils/paginate.js";

export const getClient = async (req, res) => {
  const pageSize = 10;
  const modelName = "client";
  try {
    const currPage = req.query.page || 1;
    const clients = await paginate(
      currPage,
      pageSize,
      modelName,
      {},
      { id: true, name: true },
    );
    res.status(200).json({ success: true, clientData: clients });
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
          error: "'A client with this email already exists.",
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
          error: "'A client with this email already exists.",
        });
      }
    } else {
      res.status(500).json({ success: false, error: "internal server error!" });
    }
  }
};
