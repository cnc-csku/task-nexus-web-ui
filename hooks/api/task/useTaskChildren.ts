import axios from "@/lib/axios/axios.config";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import taskQueryKeys from "./taskQueryKeys";
import { ListTaskChildrenFilter, Task } from "@/interfaces/Task";
import { accessTokenHeader } from "@/utils/apiUtils";
import { convertListTaskChildrenFilterToQueryParams } from "@/converters/taskConverter";

const fetchChildrenTasks = async (token: string, projectId: string, filter: ListTaskChildrenFilter) => {
    const response = await axios.get<Task[]>(
        `/projects/v1/${projectId}/tasks/v1/children?${convertListTaskChildrenFilterToQueryParams(filter)}`,
        accessTokenHeader(token)
    );

    response.data.forEach((task) => {
        if (task.dueDate) {
            task.dueDate = new Date(task.dueDate);
        }

        if (task.startDate) {
            task.startDate = new Date(task.startDate);
        }

        task.createdAt = new Date(task.createdAt);
        task.updatedAt = new Date(task.updatedAt);
    });

    return response.data;
};

const useTaskChildren = (projectId: string, filter: ListTaskChildrenFilter) => {
    const { data: session, status } = useSession();

    const isAuthenticated = status === "authenticated";
    const token = session?.user?.token;

    return useQuery({
        queryKey: taskQueryKeys.children(projectId, filter.parentTaskRef),
        queryFn: () => fetchChildrenTasks(token!, projectId, filter),
        enabled: isAuthenticated,
    });
};

export default useTaskChildren;
