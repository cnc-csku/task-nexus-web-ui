import { TaskType } from "@/enums/Task";
import { Chip } from "@heroui/chip";
import { ReactNode } from "react";
import { FaBug, FaClipboardCheck, FaDiamond } from "react-icons/fa6";
import { RiBookFill } from "react-icons/ri";

export interface TaskBadgeProps {
  taskType: TaskType;
  size: "sm" | "md" | "lg";
}

export default function TaskBadge({ taskType, size }: TaskBadgeProps) {
  const taskBgColor: Record<TaskType, string> = {
    [TaskType.Epic]: "bg-purple-200",
    [TaskType.Story]: "bg-emerald-200",
    [TaskType.Task]: "bg-blue-200",
    [TaskType.Bug]: "bg-red-200",
    [TaskType.SubTask]: "bg-green-200",
  };

  const taskTextColor: Record<TaskType, string> = {
    [TaskType.Epic]: "text-purple-800",
    [TaskType.Story]: "text-emerald-800",
    [TaskType.Task]: "text-blue-800",
    [TaskType.Bug]: "text-red-800",
    [TaskType.SubTask]: "text-green-800",
  };

  const taskIcons: Record<TaskType, ReactNode> = {
    [TaskType.Story]: <RiBookFill />,
    [TaskType.Task]: <FaClipboardCheck />,
    [TaskType.Bug]: <FaBug />,
    [TaskType.Epic]: <FaDiamond />,
    [TaskType.SubTask]: <FaClipboardCheck />,
  };

  return (
    <Chip size={size} className={`${taskBgColor[taskType]} ${taskTextColor[taskType]}`}>
      <div className="flex items-center space-x-1">
        <div>{taskIcons[taskType]}</div>
        <div>{taskType}</div>
      </div>
    </Chip>
  );
}
