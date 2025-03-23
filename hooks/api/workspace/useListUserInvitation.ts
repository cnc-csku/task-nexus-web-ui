import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from "@/lib/axios/axios.config";
import { accessTokenHeader } from "@/utils/apiUtils";
import { UserInvitationResponse } from "@/interfaces/Workspace";
import workspaceQueryKeys from "./workspaceQueryKeys";

const listUserInvitation = async (
    token: string,
) => {
    const { data } = await axios.get<UserInvitationResponse>(
        `/invitations/v1/users`,
        accessTokenHeader(token)
    );

    return data;
};

const useListUserInvitation = () => {
    const { data: session } = useSession();

    const token = session?.user?.token;

    return useQuery({
        queryKey: workspaceQueryKeys.memberInvitation(session?.user?.id!),
        queryFn: () => listUserInvitation(token!),
        enabled: !!token,
    });
};

export default useListUserInvitation;
