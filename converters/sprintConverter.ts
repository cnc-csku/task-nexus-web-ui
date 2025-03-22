import { ListSprintByProjectFilter } from "@/interfaces/Sprint";

export const toQueryParams = (filter: ListSprintByProjectFilter): string => {
    const params = new URLSearchParams();

    filter.statuses?.forEach((status) => params.append("statuses", status));

    return params.toString();
}