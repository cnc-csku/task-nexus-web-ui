import { UpdateProjectAttributesTemplatesType } from "@/interfaces/Project";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { projectQueryKeys } from "./projectQueryKeys";
import axios from "@/lib/axios/axios.config";
import { MessageResponse } from "@/interfaces/API";
import { accessTokenHeader } from "@/utils/apiUtils";

const updateProjectAttributesTemplate = async (
    token: string,
    projectId: string,
    request: UpdateProjectAttributesTemplatesType
) => {
    const { data } = await axios.put<MessageResponse>(`/projects/v1/${projectId}/attribute-templates`, request, accessTokenHeader(token));

    return data;
}

interface Props {
    projectId: string;
}

const useUpdateProjectAttributesTemplate = ({ projectId }: Props) => {
    const { data: session } = useSession();

    const token = session?.user?.token;
    const userId = session?.user?.id;
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: UpdateProjectAttributesTemplatesType) => updateProjectAttributesTemplate(token!, projectId, request),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: projectQueryKeys.my(userId!) });
            queryClient.invalidateQueries({ queryKey: projectQueryKeys.byId(projectId) });
        },
    });
};

export default useUpdateProjectAttributesTemplate;