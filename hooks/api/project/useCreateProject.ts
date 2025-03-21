import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from "@/lib/axios/axios.config";
import { projectQueryKeys } from "./projectQueryKeys";
import { accessTokenHeader } from "@/utils/apiUtils";
import { CreateProjectType, Project } from "@/interfaces/Project";

const createProject = async (token: string, request: CreateProjectType) => {
  const { data } = await axios.post<Project>("/projects/v1", request, accessTokenHeader(token));

  return data;
};

const useCreateProject = () => {
  const { data: session } = useSession();

  const token = session?.user?.token;
  const userId = session?.user?.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateProjectType) => createProject(token!, request),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.my(userId!) });
    },
  });
};

export default useCreateProject;
