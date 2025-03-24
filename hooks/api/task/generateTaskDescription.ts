import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import taskQueryKeys from "./taskQueryKeys";
import { accessTokenHeader } from "@/utils/apiUtils";
import { useSession } from "next-auth/react";

const generateTaskDescription = async (token: string, title: string) => {
    const response = await axios.get(`/generate-description?prompt=${title}`, accessTokenHeader(token));
    return response.data;
};

const useGenerateTaskDescription = (title: string) => {
    const { data: session } = useSession();

    const token = session?.user?.token;
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: taskQueryKeys.gen(title),
        queryFn: () => generateTaskDescription(token!, title),
        enabled: !!token,
    });
};

export default useGenerateTaskDescription;