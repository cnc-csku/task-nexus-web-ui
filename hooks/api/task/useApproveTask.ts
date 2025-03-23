import { ApproveTaskType } from "@/interfaces/Task";
import axios from "@/lib/axios/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import taskQueryKeys from "./taskQueryKeys";
import { accessTokenHeader } from "@/utils/apiUtils";

const approveTask = async (token: string, projectId: string, taskRef: string, data: ApproveTaskType) => {
    const response = await axios.put(`/projects/v1/${projectId}/tasks/v1/${taskRef}/approve`, data, accessTokenHeader(token));

    return response.data;
};

export const useApproveTask = (projectId: string, taskRef: string) => {
    const { data: session } = useSession();

    const token = session?.user?.token;
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ApproveTaskType) => approveTask(token!, projectId, taskRef, data),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: taskQueryKeys.all });
        },
    });
};

