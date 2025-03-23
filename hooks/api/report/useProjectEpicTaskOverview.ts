import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from "@/lib/axios/axios.config";
import reportQueryKeys from "./reportQueryKeys"
import { accessTokenHeader } from "@/utils/apiUtils";

const fetchProjectEpicTaskOverview = async (projectId: string, token: string) => {
    const { data } = await axios.get(`/projects/v1/${projectId}/reports/v1/epic-task-overview`, accessTokenHeader(token));

    return data;
}

const useProjectEpicTaskOverview = (projectId: string) => {
    const { data: session, status } = useSession();

    const isAuthenticated = status === "authenticated";
    const token = session?.user?.token;

    return useQuery({
        queryKey: reportQueryKeys.epicTaskOverview(projectId),
        queryFn: () => fetchProjectEpicTaskOverview(projectId, token!),
        enabled: isAuthenticated,
    });
};

export default useProjectEpicTaskOverview;
