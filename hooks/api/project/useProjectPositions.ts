import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from "@/lib/axios/axios.config";
import { projectQueryKeys } from "./projectQueryKeys";
import { accessTokenHeader } from "@/utils/apiUtils";

const fetchProjectPositions = async (projectId: string, token: string) => {
  const { data } = await axios.get<string[]>(
    `/projects/v1/${projectId}/positions`,
    accessTokenHeader(token)
  );

  return data;
};

const useProjectPositions = (projectId: string) => {
  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated";
  const token = session?.user?.token;

  return useQuery({
    queryKey: projectQueryKeys.positions(projectId),
    queryFn: () => fetchProjectPositions(projectId, token!),
    enabled: isAuthenticated,
  });
};

export default useProjectPositions;
