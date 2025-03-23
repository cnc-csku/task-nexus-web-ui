const workspaceQueryKeys = {
  all: ["Workspaces"],
  my: (userId: string) => [...workspaceQueryKeys.all, "My", userId],
  byId: (id: string) => [...workspaceQueryKeys.all, id],
  members: (workspaceId: string) => [...workspaceQueryKeys.all, "Members", workspaceId],
  memberInvitation: (memberId: string) => [
    ...workspaceQueryKeys.all,
    "MemberInvitation",
    memberId,
  ],
};

export default workspaceQueryKeys;
