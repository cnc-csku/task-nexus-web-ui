import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from "@/lib/axios/axios.config";
import { accessTokenHeader } from "@/utils/apiUtils";
import { Task } from "@/interfaces/Task";
import taskQueryKeys from "./taskQueryKeys";

const fetchTaskByRef = async (projectId: string, taskRef: string, token: string) => {
  const { data } = await axios.get<Task>(
    `/projects/v1/${projectId}/tasks/v1/${taskRef}`,
    accessTokenHeader(token)
  );

  if (data.dueDate) {
    data.dueDate = new Date(data.dueDate);
  }

  if (data.startDate) {
    data.startDate = new Date(data.startDate);
  }

  data.createdAt = new Date(data.createdAt);
  data.updatedAt = new Date(data.updatedAt);

  return data;
};

const useTaskByRef = (projectId: string, taskRef: string) => {
  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated";
  const token = session?.user?.token;

  return useQuery({
    queryKey: taskQueryKeys.byId(taskRef),
    queryFn: () => fetchTaskByRef(projectId, taskRef, token!),
    enabled: isAuthenticated,
  });
};

export default useTaskByRef;
