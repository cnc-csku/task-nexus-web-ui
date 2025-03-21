import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from '@/lib/axios/axios.config';
import { accessTokenHeader } from '@/utils/apiUtils';
import { CreateTaskRequestType, Task } from "@/interfaces/Task";
import taskQueryKeys from "./taskQueryKeys";

const createTask = async (token: string, projectId: string, request: CreateTaskRequestType) => {
    const { data } = await axios.post<Task>(`/projects/v1/${projectId}/tasks/v1`, request, accessTokenHeader(token));

    return data;
};

const useCreateTask = (projectId: string) => {
    const { data: session } = useSession();

    const token = session?.user?.token;
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: CreateTaskRequestType) => createTask(token!, projectId, request),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: taskQueryKeys.all });
        },
    });
};

export default useCreateTask;
