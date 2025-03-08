import axios from "@/lib/axios/axios.config";
import { useQuery } from "@tanstack/react-query";
import workspaceQueryKeys from "./workspaceQueryKeys";
import { getSession, useSession } from "next-auth/react";
import { Workspace } from "@/interfaces/Workspace";


const fetchMyWorkspacesFn = async () => {
    const session = await getSession();

    const response = await axios.get<Workspace[]>('/workspaces/v1/own-workspaces', {
        headers: {
            Authorization: `Bearer ${session?.user?.token}`,
        }
    });

    return response.data;
}

const useMyWorkspaces = () => {
    const { data: session, status } = useSession();

    const isAuthenticated = status === 'authenticated';
    const userId = session?.user?.id;

    return useQuery({
        queryKey: workspaceQueryKeys.my(userId!),
        queryFn: fetchMyWorkspacesFn,
        enabled: isAuthenticated,
    });
}

export default useMyWorkspaces