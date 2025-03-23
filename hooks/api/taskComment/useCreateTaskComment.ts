import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from "@/lib/axios/axios.config";
import { accessTokenHeader } from "@/utils/apiUtils";
import { Comment } from "@/interfaces/Comment";
import { CreateTaskCommentType } from "@/interfaces/Comment";
import taskComentQueryKeys from "./taskCommentQueryKeys";

const createTaskComment = async (
  token: string,
  projectId: string,
  taskRef: string,
  request: CreateTaskCommentType
) => {
  const { data } = await axios.post<Comment>(
    `/projects/v1/${projectId}/tasks/v1/${taskRef}/comments`,
    request,
    accessTokenHeader(token)
  );

  return data;
};

const useCreateTaskComment = (projectId: string, taskRef: string) => {
  const { data: session } = useSession();

  const token = session?.user?.token;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateTaskCommentType) =>
      createTaskComment(token!, projectId, taskRef, request),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: taskComentQueryKeys.all });
    },
  });
};

export default useCreateTaskComment;
