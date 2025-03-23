import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from "@/lib/axios/axios.config";
import { accessTokenHeader } from "@/utils/apiUtils";
import { InvitationActionType } from "@/interfaces/Workspace";
import workspaceQueryKeys from "./workspaceQueryKeys";
import { MessageResponse } from "@/interfaces/API";

const inviteWorkspaceMember = async (
    token: string,
    request: InvitationActionType
) => {
    const { data } = await axios.put<MessageResponse>(
        `/invitations/v1/users`,
        request,
        accessTokenHeader(token)
    );

    return data;
};

const useInvitationAction = () => {
    const { data: session } = useSession();

    const token = session?.user?.token;
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: InvitationActionType) => inviteWorkspaceMember(token!, request),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: workspaceQueryKeys.all });
        },
    });
};

export default useInvitationAction;
