import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from "@/lib/axios/axios.config";
import reportQueryKeys from "./reportQueryKeys"
import { accessTokenHeader } from "@/utils/apiUtils";

const fetchProjectTypeOverview = async (projectId: string, token: string) => {
    const { data } = await axios.get(`/projects/v1/${projectId}/reports/v1/type-overview`, accessTokenHeader(token));

    return data;
}

const useProjectTypeOverview = (projectId: string) => {
    const { data: session, status } = useSession();

    const isAuthenticated = status === "authenticated";
    const token = session?.user?.token;

    return useQuery({
        queryKey: reportQueryKeys.typeOverview(projectId),
        queryFn: () => fetchProjectTypeOverview(projectId, token!),
        enabled: isAuthenticated,
    });
};

export default useProjectTypeOverview;
