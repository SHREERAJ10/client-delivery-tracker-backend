import { paginate } from "../../utils/paginate.js"

const pageSize = 10;
const modelName = "client";

const getClientController = async(req, res)=>{
    try{
        const currPage = req.query.page || 1;
        const clients = await paginate(currPage, pageSize, modelName, {}, {id:true,name:true} );;
        res.status(200).json({'success':true, 'clientData':clients});
    }
    catch(err){
        console.log(err);
        res.status(500).json({'success':false,'error':'internal server error!'});
    }
}

export default getClientController;