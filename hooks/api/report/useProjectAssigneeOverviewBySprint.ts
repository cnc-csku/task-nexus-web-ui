import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from "@/lib/axios/axios.config";
import reportQueryKeys from "./reportQueryKeys"
import { accessTokenHeader } from "@/utils/apiUtils";

const fetchProjectAssigneeOverviewBySprint = async (projectId: string, token: string) => {
    const { data } = await axios.get(`/projects/v1/${projectId}/reports/v1/assignee-overview-by-sprint?getAllSprint=true`, accessTokenHeader(token));

    return data;
}

const useProjectAssigneeOverviewBySprint = (projectId: string) => {
    const { data: session, status } = useSession();

    const isAuthenticated = status === "authenticated";
    const token = session?.user?.token;

    return useQuery({
        queryKey: reportQueryKeys.assigneeOverviewBySprint(projectId),
        queryFn: () => fetchProjectAssigneeOverviewBySprint(projectId, token!),
        enabled: isAuthenticated,
    });
};

export default useProjectAssigneeOverviewBySprint;
