import { FindManyTasksFilter, ListTasksFilter } from "@/interfaces/Task";

export const convertListTasksFiltertoToQueryParams = (filter: ListTasksFilter): string => {
  const params = new URLSearchParams();

  if (filter.epicTaskId) {
    params.append("epicTaskId", filter.epicTaskId);
  }

  if (filter.isTaskInBacklog) {
    params.append("isTaskInBacklog", filter.isTaskInBacklog.toString());
  }

  filter.sprintIds?.forEach((sprintId) => params.append("sprintIds", sprintId));
  filter.positions?.forEach((position) => params.append("positions", position));
  filter.statuses?.forEach((status) => params.append("statuses", status));
  filter.userIds?.forEach((userId) => params.append("userIds", userId));
  filter.types.forEach((type) => params.append("types", type));

  if (filter.searchKeyword) {
    params.append("searchKeyword", filter.searchKeyword);
  }

  return params.toString();
}

export const convertFindManyTasksFilterToQueryParams = (filter: FindManyTasksFilter): string => {
  const params = new URLSearchParams();

  filter.taskRefs?.forEach((taskRef) => params.append("taskRefs", taskRef));

  return params.toString();
};

