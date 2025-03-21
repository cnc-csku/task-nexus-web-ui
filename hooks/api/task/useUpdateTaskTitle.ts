import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from '@/lib/axios/axios.config';
import { accessTokenHeader } from '@/utils/apiUtils';
import { UpdateTaskTitleFormType, Task } from "@/interfaces/Task";
import taskQueryKeys from "./taskQueryKeys";

const updateTaskTitle = async (token: string, projectId: string, taskRef: string, request: UpdateTaskTitleFormType) => {
    const { data } = await axios.put<Task>(`/projects/v1/${projectId}/tasks/v1/${taskRef}/title`, request, accessTokenHeader(token));

    return data;
};

const useUpdateTaskTitle = (projectId: string, taskRef: string) => {
    const { data: session } = useSession();

    const token = session?.user?.token;
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: UpdateTaskTitleFormType) => updateTaskTitle(token!, projectId, taskRef, request),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: taskQueryKeys.all });
        },
    });
};

export default useUpdateTaskTitle;
