import { TaskPriority, TaskType } from "@/enums/Task";
import { z } from "zod";

export interface Task {
    id: string;
    taskRef: string;
    projectId: string;
    title: string;
    description: string;
    parentId: string | null;
    type: TaskType;
    status: string;
    priority: TaskPriority;
    approvals: TaskApproval[];
    assignees: TaskAssignee[];
    childrenPoint: number;
    hasChildren: boolean;
    sprint: TaskSprint | null;
    attributes: any[];
    startDate: string | null;
    dueDate: string | null;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
}

export interface TaskApproval {
    isApproved: boolean;
    reason: string;
    userId: string;
}

export interface TaskAssignee {
    position: string;
    userId: string;
    point?: number;
}

export interface TaskSprint {
    previousSprintIds: string[];
    currentSprintId: string;
}

export interface ListTasksFilter {
    sprintId?: string;
    epicTaskId?: string;
    userIds: string[] | null;
    positions: string[] | null;
    statuses: string[] | null;
    searchKeyword: string;
}

export interface TaskApprovalSummary {
    status: string;
    pending: number;
    allApproved: number;
}

export const QuickCreateEpicSchema = z.object({
    title: z.string().nonempty(),
    startDate: z.date().nullable(),
    dueDate: z.date().nullable(),
})

export type QuickCreateEpicType = z.infer<typeof QuickCreateEpicSchema>;


export const CreateTaskRequestSchema = z.object({
    projectId: z.string().nonempty(),
    title: z.string().nonempty(),
    description: z.string().nullable(),
    parentId: z.string().nullable(),
    type: z.string().nonempty(),
    sprintId: z.string().nullable(),
})

export type CreateTaskRequestType = z.infer<typeof CreateTaskRequestSchema>;

export const UpdateTaskTitleFormSchema = z.object({
    title: z.string().nonempty(),
})

export type UpdateTaskTitleFormType = z.infer<typeof UpdateTaskTitleFormSchema>;

export const UpdateTaskStatusFormSchema = z.object({
    status: z.string().nonempty(),
})

export type UpdateTaskStatusFormType = z.infer<typeof UpdateTaskStatusFormSchema>;

export const UpdateTaskParentFormSchema = z.object({
    parentId: z.string(),
})

export type UpdateTaskParentFormType = z.infer<typeof UpdateTaskParentFormSchema>;
