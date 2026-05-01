import * as statusService from "../services/status.service.js";

export const getStatus = async (req, res)=>{
    try{
        const statusType = req.query.type || "DELIVERABLE";
        const statusList = await statusService.getStatus(statusType);
        res.status(200).json({ success: true, data: statusList });
    }
    catch(err){
        console.log(err);
        res.status(500).json({ success: false, error: "internal server error!" });
    }
}   