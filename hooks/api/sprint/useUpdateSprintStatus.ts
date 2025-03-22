import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from "@/lib/axios/axios.config";
import { accessTokenHeader } from "@/utils/apiUtils";
import { sprintQueryKeys } from "./sprintQueryKeys";
import { UpdateSprintStatusType } from "@/interfaces/Sprint";
import { MessageResponse } from "@/interfaces/API";

const updateSprintStatus = async (token: string, projectId: string, sprintId: string, request: UpdateSprintStatusType) => {
    const { data } = await axios.put<MessageResponse>(
        `/projects/v1/${projectId}/sprints/${sprintId}/status`,
        request,
        accessTokenHeader(token)
    );

    return data;
};

const useUpdateSprintStatus = (projectId: string, sprintId: string) => {
    const { data: session } = useSession();

    const token = session?.user?.token;
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: UpdateSprintStatusType) => updateSprintStatus(token!, projectId, sprintId, request),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: sprintQueryKeys.all });
        },
    });
};

export default useUpdateSprintStatus;
