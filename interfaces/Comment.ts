import { z } from "zod";

export interface Comment {
    id: string;
    content: string;
    userId: string;
    userDisplayName: string;
    userProfileUrl: string;
    taskId: string;
    createdAt: Date;
    updatedAt: Date;
}

export const CreateTaskCommentSchema = z.object({
    content: z.string().nonempty(),
})

export type CreateTaskCommentType = z.infer<typeof CreateTaskCommentSchema>;
