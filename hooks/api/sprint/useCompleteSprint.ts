import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from "@/lib/axios/axios.config";
import { accessTokenHeader } from "@/utils/apiUtils";
import { sprintQueryKeys } from "./sprintQueryKeys";
import { CompleteSprintResponse } from "@/interfaces/Sprint";

const completeSprint = async (token: string, projectId: string, sprintId: string) => {
    const { data } = await axios.put<CompleteSprintResponse>(
        `/projects/v1/${projectId}/sprints/${sprintId}/complete`,
        {},
        accessTokenHeader(token)
    );

    return data;
};

const useCompleteSprint = (projectId: string, sprintId: string) => {
    const { data: session } = useSession();

    const token = session?.user?.token;
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => completeSprint(token!, projectId, sprintId),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: sprintQueryKeys.all });
        },
    });
};

export default useCompleteSprint;
