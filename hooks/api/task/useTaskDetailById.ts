import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from '@/lib/axios/axios.config';
import { accessTokenHeader } from '@/utils/apiUtils';
import { Task } from "@/interfaces/Task";
import taskQueryKeys from "./taskQueryKeys";

const fetchTaskById = async (projectId: string, taskRef: string, token: string) => {
    const { data } = await axios.get<Task>(`/projects/v1/${projectId}/tasks/v1/${taskRef}`, accessTokenHeader(token));

    return data;
};

const useTaskById = (projectId: string, taskRef: string) => {
    const { data: session, status } = useSession();

    const isAuthenticated = status === 'authenticated';
    const token = session?.user?.token;

    return useQuery({
        queryKey: taskQueryKeys.byId(taskRef),
        queryFn: () => fetchTaskById(projectId, taskRef, token!),
        enabled: isAuthenticated,
    });
};

export default useTaskById;
