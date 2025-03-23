import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from "@/lib/axios/axios.config";
import { projectQueryKeys } from "./projectQueryKeys";
import { accessTokenHeader } from "@/utils/apiUtils";
import { InviteProjectMemberRequest, Project } from "@/interfaces/Project";

const inviteProjectMember = async (token: string, projectId: string, request: InviteProjectMemberRequest) => {
    const { data } = await axios.post<Project>(
        `/projects/v1/${projectId}/members`,
        request,
        accessTokenHeader(token)
    );

    return data;
};

const useInviteProjectMember = (projectId: string) => {
    const { data: session } = useSession();

    const token = session?.user?.token;
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: InviteProjectMemberRequest) => inviteProjectMember(token!, projectId, request),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: projectQueryKeys.allMembers(projectId) });
            queryClient.invalidateQueries({ queryKey: projectQueryKeys.my(projectId) });
        },
    });
};

export default useInviteProjectMember;
