import * as dashboardService from "../services/dashboard.service.js";

export const getDashboardMetrics = async (req, res) => {
  try {
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
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "internal server error!" });
  }
};

export const getDeliverables = async (req, res) => {
  try {
    const deliverableType = req.query.type;
    const currPage = req.query.page || 1;
    const pageSize = +req.query.pageSize || 5;
    const searchQuery = req.query.searchQuery;

    const response = await dashboardService.getDeliverables(
      deliverableType,
      currPage,
      pageSize,
      searchQuery,
    );
    res.status(200).json({ success: true, data: response });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "internal server error!" });
  }
};
