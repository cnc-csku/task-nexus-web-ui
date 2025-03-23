import { z } from "zod";
import { PaginationResponse } from "./Common";
import { WorkspaceMemberRole } from "@/enums/Workspace";

export interface Workspace {
  id: string;
  name: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface MyWorkspace extends Workspace {
  id: string;
  name: string;
  role: string;
  joinedAt: Date;
}

export interface WorkspaceWithMembers extends Workspace {
  members: WorkspaceMember[];
}

export interface WorkspaceMember {
  userId: string;
  name: string;
  role: string;
  joinedAt: Date;
}

export const CreateWorkspaceFormSchema = z.object({
  name: z.string().nonempty(),
});

export type CreateWorkspaceFormType = z.infer<typeof CreateWorkspaceFormSchema>;

export interface CreateWorkspaceRequest {
  name: string;
}

export interface CreateWorkspaceResponse {
  id: string;
  name: string;
  members: WorkspaceMember[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMemberDetail {
  workspaceMemberId: string;
  userId: string;
  role: string;
  joinedAt: string;
  email: string;
  fullName: string;
  displayName: string;
  profileUrl: string;
}
export interface WorkspaceMemberResponse {
  members: WorkspaceMemberDetail[];
  paginationResponse: PaginationResponse;
}

export const InviteWorkspaceMemberFormSchema = z.object({
  workspaceId: z.string().nonempty(),
  inviteeEmail: z.string().nonempty(),
  role: z.nativeEnum(WorkspaceMemberRole),
});

export type InviteWorkspaceMemberFormType = z.infer<typeof InviteWorkspaceMemberFormSchema>;

export interface UserInvitation {
  invitationId: string;
  workspaceId: string;
  workspaceName: string;
  role: string;
  status: string;
}

export interface UserInvitationResponse {
  invitations: UserInvitation[];
}

export const InvitationActionSchema = z.object({
  invitationId: z.string().nonempty(),
  action: z.enum(["ACCEPT", "REJECT"]),
});

export type InvitationActionType = z.infer<typeof InvitationActionSchema>;
