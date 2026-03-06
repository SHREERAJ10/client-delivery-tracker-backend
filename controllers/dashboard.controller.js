import * as dashboardService from "../services/dashboard.service.js";

export const getDashboardMetrics = async (req, res)=>{
    // const response = await dashboardService.getTotalClients();
    const response = await dashboardService.getActiveProjects();
    res.status(200).json({'success':true, 'response':response});
}