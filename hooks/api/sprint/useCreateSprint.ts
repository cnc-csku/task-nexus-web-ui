import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from "@/lib/axios/axios.config";
import { accessTokenHeader } from "@/utils/apiUtils";
import { sprintQueryKeys } from "./sprintQueryKeys";
import { Sprint } from "@/interfaces/Sprint";

const createSprint = async (token: string, projectId: string) => {
  const { data } = await axios.post<Sprint>(
    `/projects/v1/${projectId}/sprints`,
    {},
    accessTokenHeader(token)
  );

  return data;
};

const useCreateSprint = (projectId: string) => {
  const { data: session } = useSession();

  const token = session?.user?.token;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => createSprint(token!, projectId),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: sprintQueryKeys.all });
    },
  });
};

export default useCreateSprint;
