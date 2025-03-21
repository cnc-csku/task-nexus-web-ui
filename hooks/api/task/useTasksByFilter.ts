import axios from "@/lib/axios/axios.config";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import taskQueryKeys from "./taskQueryKeys";
import { ListTasksFilter, Task } from "@/interfaces/Task";
import { accessTokenHeader } from "@/utils/apiUtils";
import { toQueryParams } from "@/converters/queryParamsConverter";


const fetchTasksByFilter = async (token: string, projectId: string, params: ListTasksFilter) => {
    const queries = toQueryParams(params);

    const response = await axios.get<Task[]>(`/projects/v1/${projectId}/tasks/v1?${queries}`, accessTokenHeader(token));

    return response.data;
}

const useTasksByFilter = (projectId: string, filter: ListTasksFilter) => {
    const { data: session, status } = useSession();

    const isAuthenticated = status === 'authenticated';
    const token = session?.user?.token;

    return useQuery({
        queryKey: taskQueryKeys.byProjectIdWithFilter(projectId, filter),
        queryFn: () => fetchTasksByFilter(token!, projectId, filter),
        enabled: isAuthenticated,
    });
}

export default useTasksByFilter