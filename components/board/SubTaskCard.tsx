"use client";

import { Avatar } from "@heroui/avatar";
import { Badge } from "@heroui/badge";
import { Task } from "@/interfaces/Task";
import TaskBadge from "../task/TaskBadge";
import { Tooltip } from "@heroui/tooltip";
import { priorityIcons } from "../icons/task";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

export interface SubTaskCardProps {
  draggingTaskRef: string | null;
  task: Task;
  onOpenTaskDetailModal: (task: Task) => void;
}

export default function SubTaskCard({
  draggingTaskRef,
  task,
  onOpenTaskDetailModal,
}: SubTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, setActivatorNodeRef } = useDraggable({
    id: task.taskRef,
    data: {
      status: task.status,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const isDragging = task.taskRef === draggingTaskRef;

  return (
    <div>
      <div
        className={`shadow-none border-1 border-gray-300 px-3 py-3 rounded-lg bg-white grid gap-4 transition-colors ${
          isDragging ? "border-dashed border-gray-700 z-50" : ""
        }`}
        onClick={() => onOpenTaskDetailModal(task)}
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={style}
      >
        <div className="flex items-center gap-2">
          <TaskBadge
            taskType={task.type}
            size="sm"
          />
          <div className="font-medium text-sm">{task.taskRef}</div>
        </div>
        <div className="text-sm">{task.title}</div>
        <div>
          <div className="flex items-center gap-2 justify-between mt-2">
            <div className="flex items-center gap-2 mb-2">
              {task.assignees
                .filter(
                  (assignee) =>
                    assignee.point !== null &&
                    assignee.userId !== "" &&
                    assignee.userId !== undefined
                )
                .map((assignee, index) => (
                  <Badge
                    key={index}
                    color="primary"
                    content={assignee.point}
                    placement="bottom-right"
                    size="sm"
                  >
                    <Tooltip
                      key={assignee.userId}
                      closeDelay={100}
                      showArrow={true}
                      content={
                        <div>
                          <div className="text-center font-semibold">{assignee.position}</div>
                          <div>{assignee.displayName || "Unassigned"}</div>
                        </div>
                      }
                    >
                      <Avatar
                        src={assignee.profileUrl || ""}
                        size="sm"
                        className="w-[26px] h-[26px]"
                      />
                    </Tooltip>
                  </Badge>
                ))}
            </div>
            <div className="flex items-center gap-2">
              {priorityIcons[task.priority]}
              <p className="text-xs">{task.priority}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
