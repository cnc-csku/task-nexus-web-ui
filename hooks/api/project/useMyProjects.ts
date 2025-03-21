import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from "@/lib/axios/axios.config";
import { projectQueryKeys } from "./projectQueryKeys";
import { accessTokenHeader } from "@/utils/apiUtils";
import { Project } from "@/interfaces/Project";

const fetchMyProjects = async (workspaceId: string, token: string) => {
  const { data } = await axios.get<Project[]>(
    `/workspaces/v1/${workspaceId}/my-projects`,
    accessTokenHeader(token)
  );

  return data;
};

const useMyProjects = (workspaceId: string) => {
  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated";
  const token = session?.user?.token;
  const userId = session?.user?.id;

  return useQuery({
    queryKey: projectQueryKeys.my(userId!),
    queryFn: () => fetchMyProjects(workspaceId, token!),
    enabled: isAuthenticated,
  });
};

export default useMyProjects;
