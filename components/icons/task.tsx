import { ReactNode } from "react";
import { MdCheckCircle, MdCircle, MdDangerous, MdReportProblem, MdWarning } from "react-icons/md";
import { FaClipboardCheck, FaBug } from "react-icons/fa";
import { TaskPriority, TaskType } from "@/enums/Task";
import { FaDiamond } from "react-icons/fa6";
import { RiBookFill } from "react-icons/ri";

export const priorityIcons: Record<TaskPriority, ReactNode> = {
  [TaskPriority.Low]: <MdCircle className="text-green-500" size={12} />,
  [TaskPriority.Medium]: <MdCircle className="text-yellow-500" size={12} />,
  [TaskPriority.High]: <MdCircle className="text-orange-500" size={12} />,
  [TaskPriority.Critical]: <MdCircle className="text-red-600" size={12} />,
};

export const taskIcons: Record<TaskType, ReactNode> = {
  [TaskType.Story]: <RiBookFill className="text-emerald-500" />,
  [TaskType.Task]: <FaClipboardCheck className="text-blue-500" />,
  [TaskType.Bug]: <FaBug className="text-red-500" />,
  [TaskType.Epic]: <FaDiamond className="text-purple-500" />,
  [TaskType.SubTask]: <FaClipboardCheck className="text-green-500" />,
};
