import { ListTasksFilter } from "@/interfaces/Task";

export function toQueryParams(filter: ListTasksFilter): string {
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

  if (filter.searchKeyword) {
    params.append("searchKeyword", filter.searchKeyword);
  }

  return params.toString();
}
