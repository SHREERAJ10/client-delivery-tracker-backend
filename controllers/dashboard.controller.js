import * as dashboardService from "../services/dashboard.service.js";

export const getDashboardMetrics = async (req, res) => {
  const totalClients = await dashboardService.getTotalClients();
  const activeProjects = await dashboardService.getActiveProjects();
  const deliverablesDueThisWeek =
    await dashboardService.getDeliverablesDueThisWeekCount();
  const overdueDeliverables =
    await dashboardService.getOverdueDeliverablesCount();

  const response = [
    {
      key: "totalClients",
      label: "Total Clients",
      value: totalClients,
    },
    {
      key: "activeProjects",
      label: "Active Projects",
      value: activeProjects,
    },
    {
      key: "deliverablesDueThisWeek",
      label: "Due This Week",
      value: deliverablesDueThisWeek,
    },
    {
      key: "overdueDeliverables",
      label: "Overdue Deliverables",
      value: overdueDeliverables,
    },
  ];

  res.status(200).json({ success: true, data: response });
};

export const getDeliverables = async (req, res) => {
  const deliverableType = req.query.type || "overdue";
  const currPage = req.query.page || 1;
  const response =
    deliverableType == "overdue"
      ? await dashboardService.getOverdueDeliverbles(currPage)
      : deliverableType == "upcoming"
        ? await dashboardService.getUpcomingDeliverables(currPage)
        : null;
  res.status(200).json({ success: true, data: response });
};
