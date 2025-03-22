import axios from "@/lib/axios/axios.config";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import taskQueryKeys from "./taskQueryKeys";
import { FindManyTasksFilter, Task } from "@/interfaces/Task";
import { accessTokenHeader } from "@/utils/apiUtils";
import { convertFindManyTasksFilterToQueryParams } from "@/converters/taskConverter";

const fetchManyTasks = async (token: string, projectId: string, filter: FindManyTasksFilter) => {
  const response = await axios.get<Task[]>(
    `/projects/v1/${projectId}/tasks/v1/detail?${convertFindManyTasksFilterToQueryParams(filter)}`,
    accessTokenHeader(token)
  );

  return response.data;
};

const useFindManyTasks = (projectId: string, filter: FindManyTasksFilter) => {
  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated";
  const token = session?.user?.token;

  return useQuery({
    queryKey: taskQueryKeys.many(projectId, filter.taskRefs),
    queryFn: () => fetchManyTasks(token!, projectId, filter),
    enabled: isAuthenticated,
  });
};

export default useFindManyTasks;
