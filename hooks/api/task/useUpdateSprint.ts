import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from '@/lib/axios/axios.config';
import { accessTokenHeader } from '@/utils/apiUtils';
import { Task, UpdateTaskSprintFormType } from "@/interfaces/Task";
import taskQueryKeys from "./taskQueryKeys";

const updateTaskSprint = async (token: string, projectId: string, request: UpdateTaskSprintFormType) => {
    const { data } = await axios.put<Task>(`/projects/v1/${projectId}/tasks/v1/${request.taskRef}/sprint`, request, accessTokenHeader(token));

    return data;
};

const useUpdateTaskSprint = (projectId: string) => {
    const { data: session } = useSession();

    const token = session?.user?.token;
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: UpdateTaskSprintFormType) => updateTaskSprint(token!, projectId, request),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: taskQueryKeys.all });
        },
    });
};

export default useUpdateTaskSprint;
