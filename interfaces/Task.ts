import { TaskPriority, TaskType } from "@/enums/Task";
import { z } from "zod";

export interface KeyValue {
  key: string;
  value: any;
}

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
  attributes: KeyValue[];
  startDate: Date | null;
  dueDate: Date | null;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
}

export interface TaskApproval {
  isApproved: boolean;
  reason: string;
  userId: string;
  email: string;
  profileUrl: string;
  displayName: string;
}

export interface TaskAssignee {
  position: string | null;
  userId: string | null;
  email: string | null;
  displayName: string | null;
  profileUrl: string | null;
  point?: number;
}

export interface TaskSprint {
  previousSprintIds: string[];
  currentSprintId: string;
}

export interface ListTasksFilter {
  sprintIds?: string[];
  epicTaskId?: string;
  userIds: string[] | null;
  positions: string[] | null;
  statuses: string[] | null;
  isTaskInBacklog?: boolean;
  searchKeyword: string;
  types: TaskType[];
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
});

export type QuickCreateEpicType = z.infer<typeof QuickCreateEpicSchema>;

export const CreateTaskRequestSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().nullable(),
  parentId: z.string().nullable(),
  type: z.string().nonempty(),
  sprintId: z.string().nullable(),
  startDate: z.date().nullable(),
  dueDate: z.date().nullable(),
  priority: z.string().nullable(),
  assignees: z.array(
    z.object({
      position: z.string().nonempty(),
      userId: z.string().nullable(),
      point: z.number().min(0).max(100).nullable(),
    })
  ),
  additionalFields: z.record(z.any()).nullable(),
  approvalUserIds: z.array(z.string()).nullable(),
});

export type CreateTaskRequestType = z.infer<typeof CreateTaskRequestSchema>;

export const UpdateTaskTitleFormSchema = z.object({
  title: z.string().nonempty(),
});

export type UpdateTaskTitleFormType = z.infer<typeof UpdateTaskTitleFormSchema>;

export const UpdateTaskStatusFormSchema = z.object({
  status: z.string().nonempty(),
});

export type UpdateTaskStatusFormType = z.infer<typeof UpdateTaskStatusFormSchema>;

export const UpdateTaskParentFormSchema = z.object({
  parentId: z.string().nullable(),
});

export type UpdateTaskParentFormType = z.infer<typeof UpdateTaskParentFormSchema>;

export const UpdateTaskSprintFormSchema = z.object({
  taskRef: z.string().nonempty(),
  currentSprintId: z.string().nullable(),
});

export type UpdateTaskSprintFormType = z.infer<typeof UpdateTaskSprintFormSchema>;

export interface UpdateTaskSprintRequest {
  currentSprintId: string | null;
}

export interface FindManyTasksFilter {
  taskRefs: string[];
}

export const UpdateTaskAssigneesSchema = z.object({
  assignees: z.array(
    z.object({
      position: z.string().nullable(),
      userId: z.string().nullable(),
      point: z.number().min(0).max(100).nullable(),
    })
  ),
})

export type UpdateTaskAssigneesType = z.infer<typeof UpdateTaskAssigneesSchema>;

export const UpdateTaskDetailSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().nullable(),
  priority: z.string().nonempty(),
  startDate: z.date().nullable(),
  dueDate: z.date().nullable(),
});

export type UpdateTaskDetailType = z.infer<typeof UpdateTaskDetailSchema>;

export interface ListTaskChildrenFilter {
  parentTaskRef: string;
}

export const ApproveTaskSchema = z.object({
  reason: z.string().nonempty(),
});

export type ApproveTaskType = z.infer<typeof ApproveTaskSchema>;
