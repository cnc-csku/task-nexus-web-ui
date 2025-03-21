import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from '@/lib/axios/axios.config';
import { projectQueryKeys } from "./projectQueryKeys";
import { accessTokenHeader } from '@/utils/apiUtils';
import { ListProjectMembersParams, ListProjectMembersResponse, ProjectMember } from "@/interfaces/Project";
import { SortOrder } from "@/enums/Common";

const fetchAllProjectMembers = async (projectId: string, batchSize: number, token: string) => {
    let page = 1;

    const allMembers: ProjectMember[] = [];

    while (true) {
        const params: ListProjectMembersParams = {
            page: page,
            order: SortOrder.Asc,
            pageSize: 20,
            sortBy: "display_name",
        }
        const paramsList = Object.entries(params).filter(([, value]) => value !== undefined);

        const query = new URLSearchParams(paramsList).toString();

        const { data } = await axios.get<ListProjectMembersResponse>(`/projects/v1/${projectId}/members?${query}`, accessTokenHeader(token));

        allMembers.push(...data.members);

        if (page === data.paginationResponse.totalPage) {
            break;
        }

        page++;
    }

    return allMembers;
};

const useAllProjectMembers = (projectId: string, batchSize: number) => {
    const { data: session, status } = useSession();

    const isAuthenticated = status === 'authenticated';
    const token = session?.user?.token;

    return useQuery({
        queryKey: projectQueryKeys.allMembers(projectId),
        queryFn: () => fetchAllProjectMembers(projectId, batchSize, token!),
        enabled: isAuthenticated,
    });
};

export default useAllProjectMembers;
