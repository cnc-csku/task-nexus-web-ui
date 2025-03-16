import { ListTasksFilter } from "@/interfaces/Task";

export function toQueryParams(filter: ListTasksFilter): string {
    const params = new URLSearchParams();

    if (filter.sprintId) {
        params.append('sprintId', filter.sprintId);
    }
    if (filter.epicTaskId) {
        params.append('epicTaskId', filter.epicTaskId);
    }

    filter.positions?.forEach(position => params.append('positions', position));
    filter.statuses?.forEach(status => params.append('statuses', status));
    filter.userIds?.forEach(userId => params.append('userIds', userId));

    if (filter.searchKeyword) {
        params.append('searchKeyword', filter.searchKeyword);
    }

    return params.toString();
}