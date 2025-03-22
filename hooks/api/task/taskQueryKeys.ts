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
  many: (projectId: string, taskRefs: string[]) => [...taskQueryKeys.all, "project", projectId,"many", taskRefs],
};

export default taskQueryKeys;
