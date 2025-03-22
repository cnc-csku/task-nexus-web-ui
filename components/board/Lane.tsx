"use client";

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

  return (
    <div
      className={`flex flex-col gap-2 p-3 rounded-lg bg-gray-50 ${
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
        tasks.map((task) => (
          <TaskCard
            draggingTaskRef={draggingTaskRef}
            task={task}
            key={task.id}
          />
        ))
      )}
    </div>
  );
}
