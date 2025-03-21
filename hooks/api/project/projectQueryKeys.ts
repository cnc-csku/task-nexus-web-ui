import { ListProjectMembersParams } from "@/interfaces/Project";

export const projectQueryKeys = {
  all: ["projects"],
  my: (userId: string) => [...projectQueryKeys.all, "my", userId],
  byId: (projectId: string) => [...projectQueryKeys.all, projectId],
  positions: (projectId: string) => [...projectQueryKeys.all, projectId, "positions"],
  allMembers: (projectId: string) => [...projectQueryKeys.all, projectId, "members"],
  membersPage: (projectId: string, params: ListProjectMembersParams) => [
    ...projectQueryKeys.all,
    "members",
    projectId,
    params,
  ],
};
