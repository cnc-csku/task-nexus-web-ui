const workspaceQueryKeys = {
  all: ["Workspaces"],
  my: (userId: string) => [...workspaceQueryKeys.all, "My", userId],
  byId: (id: string) => [...workspaceQueryKeys.all, id],
};

export default workspaceQueryKeys;
