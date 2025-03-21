import axios from "@/lib/axios/axios.config";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { accessTokenHeader } from "@/utils/apiUtils";
import { sprintQueryKeys } from "./sprintQueryKeys";
import { Sprint } from "@/interfaces/Sprint";


const fetchSprintsByProjectId = async (token: string, projectId: string) => {
    const response = await axios.get<Sprint[]>(`/projects/v1/${projectId}/sprints`, accessTokenHeader(token));

    return response.data;
}

const useSprintsByProjectId = (projectId: string) => {
    const { data: session, status } = useSession();

    const isAuthenticated = status === 'authenticated';
    const token = session?.user?.token;

    return useQuery({
        queryKey: sprintQueryKeys.byProjectId(projectId),
        queryFn: () => fetchSprintsByProjectId(token!, projectId),
        enabled: isAuthenticated,
    });
}

export default useSprintsByProjectId