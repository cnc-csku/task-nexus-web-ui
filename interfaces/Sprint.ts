import { SprintStatus } from "@/enums/Sprint";
import { z } from "zod";

export interface Sprint {
  id: string;
  projectId: string;
  title: string;
  status: SprintStatus;
  sprintGoal: string | null;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export const UpdateSprintSchema = z.object({
  title: z.string().nonempty(),
  sprintGoal: z.string().nullable(),
  startDate: z.date().nullable(),
  endDate: z.date().nullable(),
})

export type UpdateSprintType = z.infer<typeof UpdateSprintSchema>

export const UpdateSprintStatusSchema = z.object({
  status: z.nativeEnum(SprintStatus),
})

export type UpdateSprintStatusType = z.infer<typeof UpdateSprintStatusSchema>

export const StartSprintSchema = z.object({
  sprintGoal: z.string().nullable(),
  startDate: z.date().nullable(),
  endDate: z.date().nullable(),
})

export type StartSprintType = z.infer<typeof StartSprintSchema>

export interface CompleteSprintResponse {
  fields?: string[];
  message: string;
  status: string;
}

export interface ListSprintByProjectFilter {
  statuses?: SprintStatus[];
}