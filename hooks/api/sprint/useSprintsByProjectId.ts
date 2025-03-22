import axios from "@/lib/axios/axios.config";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { accessTokenHeader } from "@/utils/apiUtils";
import { sprintQueryKeys } from "./sprintQueryKeys";
import { ListSprintByProjectFilter, Sprint } from "@/interfaces/Sprint";
import { toQueryParams } from "@/converters/sprintConverter";

const fetchSprintsByProjectId = async (token: string, projectId: string, filter?: ListSprintByProjectFilter) => {
  const response = await axios.get<Sprint[]>(
    `/projects/v1/${projectId}/sprints?${toQueryParams(filter || {})}`,
    accessTokenHeader(token)
  );
  
  response.data.forEach((sprint) => {
    sprint.startDate = sprint.startDate ? new Date(sprint.startDate) : null;
    sprint.endDate = sprint.endDate ? new Date(sprint.endDate) : null;
  })

  return response.data;
};

const useSprintsByProjectId = (projectId: string, filter?: ListSprintByProjectFilter) => {
  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated";
  const token = session?.user?.token;

  return useQuery({
    queryKey: sprintQueryKeys.byProjectId(projectId),
    queryFn: () => fetchSprintsByProjectId(token!, projectId, filter),
    enabled: isAuthenticated,
  });
};

export default useSprintsByProjectId;
