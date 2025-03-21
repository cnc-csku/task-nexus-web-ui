import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from "@/lib/axios/axios.config";
import { projectQueryKeys } from "./projectQueryKeys";
import { accessTokenHeader } from "@/utils/apiUtils";
import { Project } from "@/interfaces/Project";

const fetchProject = async (projectId: string, token: string) => {
  const { data } = await axios.get<Project>(`/projects/v1/${projectId}`, accessTokenHeader(token));

  return data;
};

const useFindProjectById = (projectId: string) => {
  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated";
  const token = session?.user?.token;

  return useQuery({
    queryKey: projectQueryKeys.byId(projectId),
    queryFn: () => fetchProject(projectId, token!),
    enabled: isAuthenticated,
  });
};

export default useFindProjectById;
