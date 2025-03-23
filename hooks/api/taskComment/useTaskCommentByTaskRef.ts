import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from "@/lib/axios/axios.config";
import { accessTokenHeader } from "@/utils/apiUtils";
import { Comment } from "@/interfaces/Comment";
import taskComentQueryKeys from "./taskCommentQueryKeys";

const fetchCommentByTaskRef = async (projectId: string, taskRef: string, token: string) => {
    const { data } = await axios.get<Comment[]>(
        `/projects/v1/${projectId}/tasks/v1/${taskRef}/comments`,
        accessTokenHeader(token)
    );

    data.forEach((comment) => {
        comment.createdAt = new Date(comment.createdAt);
    });

    return data;
};

const useTaskCommentByTaskRef = (projectId: string, taskRef: string) => {
    const { data: session, status } = useSession();

    const isAuthenticated = status === "authenticated";
    const token = session?.user?.token;

    return useQuery({
        queryKey: taskComentQueryKeys.byTaskRef(projectId, taskRef),
        queryFn: () => fetchCommentByTaskRef(projectId, taskRef, token!),
        enabled: isAuthenticated,
    });
};

export default useTaskCommentByTaskRef;
