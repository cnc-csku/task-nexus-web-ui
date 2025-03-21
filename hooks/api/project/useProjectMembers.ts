import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from "@/lib/axios/axios.config";
import { projectQueryKeys } from "./projectQueryKeys";
import { accessTokenHeader } from "@/utils/apiUtils";
import { ListProjectMembersParams, ListProjectMembersResponse } from "@/interfaces/Project";

const fetchProjectMembers = async (
  projectId: string,
  parmas: ListProjectMembersParams,
  token: string
) => {
  const paramsList = Object.entries(parmas).filter(([, value]) => value !== undefined);

  const query = new URLSearchParams(paramsList).toString();

  const { data } = await axios.get<ListProjectMembersResponse>(
    `/projects/v1/${projectId}/members?${query}`,
    accessTokenHeader(token)
  );

  return data;
};

const useProjectMembers = (projectId: string, params: ListProjectMembersParams) => {
  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated";
  const token = session?.user?.token;

  return useQuery({
    queryKey: projectQueryKeys.membersPage(projectId, params),
    queryFn: () => fetchProjectMembers(projectId, params, token!),
    enabled: isAuthenticated,
  });
};

export default useProjectMembers;
