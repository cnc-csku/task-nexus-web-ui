export const sprintQueryKeys = {
  all: ["sprints"],
  byId: (id: string) => [...sprintQueryKeys.all, id],
  byProjectId: (projectId: string) => [...sprintQueryKeys.all, projectId],
};
