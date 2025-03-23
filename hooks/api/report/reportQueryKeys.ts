const reportQueryKeys = {
    all: ["reports"],
    statusOverview: (projectId: string) => [...reportQueryKeys.all, projectId, "statusOverview"],
    priorityOverview: (projectId: string) => [...reportQueryKeys.all, projectId, "priorityOverview"],
    typeOverview: (projectId: string) => [...reportQueryKeys.all, projectId, "typeOverview"],
    epicTaskOverview: (projectId: string) => [...reportQueryKeys.all, projectId, "epicTaskOverview"],
    assigneeOverviewBySprint: (projectId: string) => [...reportQueryKeys.all, projectId, "assigneeOverviewBySprint"],
};

export default reportQueryKeys;
