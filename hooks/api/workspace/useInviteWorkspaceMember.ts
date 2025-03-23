import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from "@/lib/axios/axios.config";
import { accessTokenHeader } from "@/utils/apiUtils";
import { InviteWorkspaceMemberFormType } from "@/interfaces/Workspace";
import workspaceQueryKeys from "./workspaceQueryKeys";
import { MessageResponse } from "@/interfaces/API";

const inviteWorkspaceMember = async (
    token: string,
    request: InviteWorkspaceMemberFormType
) => {
    const { data } = await axios.post<MessageResponse>(
        `/invitations/v1`,
        request,
        accessTokenHeader(token)
    );

    return data;
};

const useInviteWorkspaceMember = () => {
    const { data: session } = useSession();

    const token = session?.user?.token;
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: InviteWorkspaceMemberFormType) => inviteWorkspaceMember(token!, request),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: workspaceQueryKeys.all });
        },
    });
};

export default useInviteWorkspaceMember;
