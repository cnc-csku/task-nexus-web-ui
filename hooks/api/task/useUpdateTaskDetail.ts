import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from "@/lib/axios/axios.config";
import { accessTokenHeader } from "@/utils/apiUtils";
import { UpdateTaskStatusFormType, Task, UpdateTaskDetailType } from "@/interfaces/Task";
import taskQueryKeys from "./taskQueryKeys";

const updateTaskDetail = async (
  token: string,
  projectId: string,
  taskRef: string,
  request: UpdateTaskDetailType
) => {
  const { data } = await axios.put<Task>(
    `/projects/v1/${projectId}/tasks/v1/${taskRef}/detail`,
    request,
    accessTokenHeader(token)
  );

  return data;
};

const useUpdateTaskDetail = (projectId: string, taskRef: string) => {
  const { data: session } = useSession();

  const token = session?.user?.token;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateTaskDetailType) =>
      updateTaskDetail(token!, projectId, taskRef, request),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.all });
    },
  });
};

export default useUpdateTaskDetail;
