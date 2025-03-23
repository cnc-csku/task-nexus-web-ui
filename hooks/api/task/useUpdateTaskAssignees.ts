import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from "@/lib/axios/axios.config";
import { accessTokenHeader } from "@/utils/apiUtils";
import { Task, UpdateTaskAssigneesType } from "@/interfaces/Task";
import taskQueryKeys from "./taskQueryKeys";

const updateTaskAssignees = async (
  token: string,
  projectId: string,
  taskRef: string,
  request: UpdateTaskAssigneesType
) => {
  const { data } = await axios.put<Task>(
    `/projects/v1/${projectId}/tasks/v1/${taskRef}/assignees`,
    request,
    accessTokenHeader(token)
  );

  return data;
};

const useUpdateTaskAssignees = (projectId: string, taskRef: string) => {
  const { data: session } = useSession();

  const token = session?.user?.token;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateTaskAssigneesType) =>
      updateTaskAssignees(token!, projectId, taskRef, request),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.all });
    },
  });
};

export default useUpdateTaskAssignees;
