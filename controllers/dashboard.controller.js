import * as dashboardService from "../services/dashboard.service.js";

export const getDashboardMetrics = async (req, res)=>{
    const totalClients = await dashboardService.getTotalClients();
    const activeProjects = await dashboardService.getActiveProjects();
    const deliverablesDueThisWeek = await dashboardService.getDeliverablesDueThisWeekCount();
    const overdueDeliverables = await dashboardService.getOverdueDeliverablesCount();

    const response = [
        {
            name:"totalClients",
            label:"Total Clients",
            count:totalClients,
        },
        {
            name:"activeProjects",
            label:"Active Projects",
            count:activeProjects,
        },
        {
            name:"deliverablesDueThisWeek",
            label:"Due This Week",
            count:deliverablesDueThisWeek,
        },
        {
            name:"overdueDeliverables",
            label:"Overdue Deliverables",
            count:overdueDeliverables,
        },
    ];

    res.status(200).json({'success':true, 'response':response});
}