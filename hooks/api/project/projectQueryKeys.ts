export const projectQueryKeys = {
    all: ['projects'],
    my: (userId: string) => [...projectQueryKeys.all, 'my', userId],
    byId: (projectId: string) => [...projectQueryKeys.all, projectId],
}