import { TaskLevel, TaskType } from "@/enums/Task";

export const getTaskLevel = (taskType: TaskType): TaskLevel => {
    switch (taskType) {
        case TaskType.Epic:
            return TaskLevel.Level0;
        case TaskType.Story:
        case TaskType.Task:
        case TaskType.Bug:
            return TaskLevel.Level1;
        case TaskType.SubTask:
            return TaskLevel.Level2;
        default:
            throw new Error("Invalid task type");
    }
}