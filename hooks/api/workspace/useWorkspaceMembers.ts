import axios from "@/lib/axios/axios.config";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { accessTokenHeader } from "@/utils/apiUtils";
import { WorkspaceMemberResponse } from "@/interfaces/Workspace";
import workspaceQueryKeys from "./workspaceQueryKeys";

const fetchWorkspaceMembers = async (token: string, workspaceId: string) => {
  const response = await axios.get<WorkspaceMemberResponse>(
    `/workspaces/v1/${workspaceId}/members`,
    accessTokenHeader(token)
  );

  return response.data;
};

const useWorkspaceMembers = (workspaceId: string) => {
  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated";
  const token = session?.user?.token;

  return useQuery({
    queryKey: workspaceQueryKeys.members(workspaceId),
    queryFn: () => fetchWorkspaceMembers(token!, workspaceId),
    enabled: isAuthenticated,
  });
};

export default useWorkspaceMembers;
