const taskComentQueryKeys = {
    all: ["TaskComment"],
    byTaskRef: (projectId: string, taskRef: string) => [...taskComentQueryKeys.all, projectId, taskRef],
    byId: (id: string) => [...taskComentQueryKeys.all, id],
};

export default taskComentQueryKeys;
