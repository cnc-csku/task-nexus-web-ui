import { ProjectStatus } from "@/enums/Project";
import { z } from "zod";
import { PaginationResponse } from "./Common";
import { SortOrder } from "@/enums/Common";

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  projectPrefix: string;
  description: string;
  status: ProjectStatus;
  sprintRunningNumber: number;
  taskRunningNumber: number;
  workflows: Workflow[];
  attributesTemplates: AttributeTemplate[];
  positions: string[];
  ownerUserId: string;
  ownerProjectMemberId: string;
  ownerDisplayName: string;
  ownerProfileUrl: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface Workflow {
  previousStatuses: string[] | null;
  status: string;
  isDefault: boolean;
  isDone: boolean;
}

export interface AttributeTemplate {
  name: string;
  type: string;
}

export interface ProjectMember {
  projectId: string;
  userId: string;
  email: string;
  fullName: string;
  displayName: string;
  profileUrl: string;
  role: string;
  position: string;
  joinedAt: string;
  removedAt?: string;
}

export interface ListProjectMembersResponse {
  members: ProjectMember[];
  paginationResponse: PaginationResponse;
}

export interface ListProjectMembersParams {
  keyword?: string;
  page: number;
  pageSize: number;
  sortBy: string;
  order: SortOrder;
}

export const CreateProjectSchema = z.object({
  workspaceId: z.string(),
  name: z.string(),
  projectPrefix: z.string(),
  description: z.string().optional(),
});

export type CreateProjectType = z.infer<typeof CreateProjectSchema>;

export const UpdateProjectPositionsSchema = z.object({
  projectId: z.string(),
  titles: z.array(z.string()),
});

export type UpdateProjectPositionsType = z.infer<typeof UpdateProjectPositionsSchema>;

export const UpdateProjectWorkflowSchema = z.object({
  projectId: z.string(),
  workflows: z.array(
    z.object({
      previousStatuses: z.array(z.string()).nullable(),
      status: z.string(),
      isDefault: z.boolean(),
      isDone: z.boolean(),
    })
  ),
});

export type UpdateProjectWorkflowType = z.infer<typeof UpdateProjectWorkflowSchema>;

export const UpdateProjectAttributesTemplatesSchema = z.object({
  projectId: z.string(),
  attributesTemplates: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
    })
  ),
});

export type UpdateProjectAttributesTemplatesType = z.infer<
  typeof UpdateProjectAttributesTemplatesSchema
>;

export const UpdateProjectMemberPositionSchema = z.object({
  userId: z.string().nonempty(),
  position: z.string().nonempty(),
});

export type UpdateProjectMemberPositionType = z.infer<typeof UpdateProjectMemberPositionSchema>;
