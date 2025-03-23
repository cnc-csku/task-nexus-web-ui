"use client";

import { TaskType } from "@/enums/Task";
import TaskCard from "./TaskCard";
import { Task } from "@/interfaces/Task";
import { useDroppable } from "@dnd-kit/core";
import { MdDoNotDisturbAlt } from "react-icons/md";

export interface LaneProps {
  draggingTaskStatus: string | null;
  draggingTaskRef: string | null;
  status: string;
  availableStatuses: string[];
  isDraggingOver: boolean;
  tasks: Task[];
}

export default function Lane({
  draggingTaskRef,
  availableStatuses,
  draggingTaskStatus,
  isDraggingOver,
  status,
  tasks,
}: LaneProps) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  const isAvailableStatus = availableStatuses.includes(status);

  const level1TaskTypes = [TaskType.Task, TaskType.Bug, TaskType.Story];
  const level2TaskTypes = [TaskType.SubTask];

  const level1Tasks = tasks.filter((task) => level1TaskTypes.includes(task.type));
  const level2Tasks = tasks.filter((task) => level2TaskTypes.includes(task.type));

  const subTasksMap = new Map<string, Task[]>();

  level2Tasks.forEach((subTask) => {
    if (!subTask.parentId) {
      return;
    }

    const parentSubTaskId = subTask.parentId;
    if (level1Tasks.find((level1Task) => level1Task.id === parentSubTaskId)) {
      const subTasks = subTasksMap.get(parentSubTaskId) || [];
      subTasks.push(subTask);
      subTasksMap.set(parentSubTaskId, subTasks);
      return;
    }
    
    level1Tasks.push(subTask);
  });

  return (
    <div
      className={`flex flex-col gap-4 p-3 rounded-lg bg-gray-50 ${
        isDraggingOver && "border border-dashed border-gray-700"
      }`}
      ref={setNodeRef}
    >
      {draggingTaskRef !== null && isAvailableStatus ? (
        <div className={`flex h-full items-center text-center justify-center`}>
          <div className="text-sm">
            Drop here to move to <span>{status}</span>
          </div>
        </div>
      ) : draggingTaskRef !== null && !isAvailableStatus && status !== draggingTaskStatus ? (
        <div className="flex h-full items-center text-center justify-center">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <MdDoNotDisturbAlt size={30} />
            </div>
            <div className="text-center text-sm">
              Cannot move to <span>{status}</span>
            </div>
          </div>
        </div>
      ) : (
        level1Tasks.map((task) => (
          <TaskCard
            draggingTaskRef={draggingTaskRef}
            task={task}
            key={task.id}
            subTasks={subTasksMap.get(task.id) || []}
          />
        ))
      )}
    </div>
  );
}
