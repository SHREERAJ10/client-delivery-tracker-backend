
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

export const createClient = async (req, res)=>{
    try{
        const {clientName} =  clientSchema.parse(req.body);
        await clientService.createClient(clientName);
        res.status(200).json({'success':true, 'message':"Client Created Successfully!"});

    }
    catch(err){
        console.log(err);
        res.json({'success':false,'error':"internal server error!"});
    }
}
