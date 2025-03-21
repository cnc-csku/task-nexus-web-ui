import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from "@/lib/axios/axios.config";
import { accessTokenHeader } from "@/utils/apiUtils";
import { UpdateTaskParentFormType, Task } from "@/interfaces/Task";
import taskQueryKeys from "./taskQueryKeys";

const updateTaskParent = async (
  token: string,
  projectId: string,
  taskRef: string,
  request: UpdateTaskParentFormType
) => {
  const { data } = await axios.put<Task>(
    `/projects/v1/${projectId}/tasks/v1/${taskRef}/parent`,
    request,
    accessTokenHeader(token)
  );

  return data;
};

const useUpdateTaskParent = (projectId: string, taskRef: string) => {
  const { data: session } = useSession();

  const token = session?.user?.token;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateTaskParentFormType) =>
      updateTaskParent(token!, projectId, taskRef, request),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.all });
    },
  });
};

export default useUpdateTaskParent;
