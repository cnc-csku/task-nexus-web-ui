import axios from "@/lib/axios/axios.config";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import taskQueryKeys from "./taskQueryKeys";
import { Task } from "@/interfaces/Task";
import { accessTokenHeader } from "@/utils/apiUtils";


const fetchEpics = async (token: string, projectId: string) => {
    const response = await axios.get<Task[]>(`/projects/v1/${projectId}/tasks/v1/epic`, accessTokenHeader(token));

    return response.data;
}

const useEpics = (projectId: string) => {
    const { data: session, status } = useSession();

    const isAuthenticated = status === 'authenticated';
    const token = session?.user?.token;

    return useQuery({
        queryKey: taskQueryKeys.epics(projectId),
        queryFn: () => fetchEpics(token!, projectId),
        enabled: isAuthenticated,
    });
}

export default useEpics