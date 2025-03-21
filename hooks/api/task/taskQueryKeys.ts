import { ListTasksFilter } from "@/interfaces/Task";

const taskQueryKeys = {
  all: ["tasks"],
  epics: (projectId: string) => [...taskQueryKeys.all, projectId, "epics"],
  byId: (id: string) => [...taskQueryKeys.all, id],
  byProjectIdWithFilter: (projectId: string, filter: ListTasksFilter) => [
    ...taskQueryKeys.all,
    projectId,
    filter,
  ],
};

export default taskQueryKeys;
