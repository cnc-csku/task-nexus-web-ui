import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from '@/lib/axios/axios.config';
import { accessTokenHeader } from '@/utils/apiUtils';
import { UpdateTaskStatusFormType, Task } from "@/interfaces/Task";
import taskQueryKeys from "./taskQueryKeys";

const updateTaskStatus = async (token: string, projectId: string, taskRef: string, request: UpdateTaskStatusFormType) => {
    const { data } = await axios.put<Task>(`/projects/v1/${projectId}/tasks/v1/${taskRef}/status`, request, accessTokenHeader(token));

    return data;
};

const useUpdateTaskStatus = (projectId: string, taskRef: string) => {
    const { data: session } = useSession();

    const token = session?.user?.token;
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: UpdateTaskStatusFormType) => updateTaskStatus(token!, projectId, taskRef, request),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: taskQueryKeys.all });
        },
    });
};

export default useUpdateTaskStatus;
