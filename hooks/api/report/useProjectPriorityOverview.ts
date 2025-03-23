import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from "@/lib/axios/axios.config";
import reportQueryKeys from "./reportQueryKeys"
import { accessTokenHeader } from "@/utils/apiUtils";

const fetchProjectPriorityOverview = async (projectId: string, token: string) => {
    const { data } = await axios.get(`/projects/v1/${projectId}/reports/v1/priority-overview`, accessTokenHeader(token));

    return data;
}

const useProjectPriorityOverview = (projectId: string) => {
    const { data: session, status } = useSession();

    const isAuthenticated = status === "authenticated";
    const token = session?.user?.token;

    return useQuery({
        queryKey: reportQueryKeys.priorityOverview(projectId),
        queryFn: () => fetchProjectPriorityOverview(projectId, token!),
        enabled: isAuthenticated,
    });
};

export default useProjectPriorityOverview;
