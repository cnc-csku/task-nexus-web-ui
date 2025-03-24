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
  many: (projectId: string, taskRefs: string[]) => [...taskQueryKeys.all, "project", projectId, "many", taskRefs],
  children: (projectId: string, parentTaskRef: string) => [
    ...taskQueryKeys.all,
    "project",
    projectId,
    "children",
    parentTaskRef,
  ],
  gen: (title: string) => [...taskQueryKeys.all, "project", "generate description", title],
};

export default taskQueryKeys;
