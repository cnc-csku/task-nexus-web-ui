import { MessageResponse } from "@/interfaces/API";
import { UpdateProjectWorkflowType } from "@/interfaces/Project";
import axios from "@/lib/axios/axios.config";
import { accessTokenHeader } from "@/utils/apiUtils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { projectQueryKeys } from "./projectQueryKeys";

interface Props {
  projectId: string;
}

const updateProjectWorkflows = async (
  token: string,
  projectId: string,
  request: UpdateProjectWorkflowType
) => {
  const { data } = await axios.put<MessageResponse>(
    `/projects/v1/${projectId}/workflows`,
    request,
    accessTokenHeader(token)
  );

  return data;
};

const useUpdateProjectWorkflows = ({ projectId }: Props) => {
  const { data: session } = useSession();

  const token = session?.user?.token;
  const userId = session?.user?.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateProjectWorkflowType) =>
      updateProjectWorkflows(token!, projectId, request),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.my(userId!) });
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.byId(projectId) });
    },
  });
};

export default useUpdateProjectWorkflows;
