import { clientSchema } from "../../models/clientModel.js";
import createClient from "../../services/client/createClient.js";

const createClientController = async (req, res)=>{
    try{
        const {clientName} =  clientSchema.parse(req.body);
        await createClient(clientName);
        res.status(200).json({'success':true, 'message':"Client Created Successfully!"});

    }
    catch(err){
        console.log(err);
        res.json({'success':false,'error':"internal server error!"});
    }
}

export default createClientController;