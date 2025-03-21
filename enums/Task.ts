export enum TaskType {
  Epic = "EPIC",
  Story = "STORY",
  Task = "TASK",
  Bug = "BUG",
  SubTask = "SUB_TASK",
}

export enum TaskPriority {
  Low = "LOW",
  Medium = "MEDIUM",
  High = "HIGH",
  Critical = "CRITICAL",
}

/**
 *
 * @enum {number}
 * @description Task levels are used to represent the hierarchy of a task.
 *
 * @property {number} Level0 - EPIC
 * @property {number} Level1 - STORY, TASK, BUG
 * @property {number} Level2 - SUB_TASK
 */
export enum TaskLevel {
  Level0 = 0,

  Level1 = 1,
  Level2 = 2,
}
