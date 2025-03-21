import { ReactNode } from "react";
import { MdCheckCircle, MdDangerous, MdReportProblem, MdWarning } from "react-icons/md";
import { FaClipboardCheck, FaBug } from "react-icons/fa";
import { TaskPriority, TaskType } from "@/enums/Task";
import { FaDiamond } from "react-icons/fa6";
import { RiBookFill } from "react-icons/ri";

export const priorityIcons: Record<TaskPriority, ReactNode> = {
  [TaskPriority.Low]: <MdCheckCircle className="text-green-500" />,
  [TaskPriority.Medium]: <MdWarning className="text-yellow-500" />,
  [TaskPriority.High]: <MdReportProblem className="text-orange-500" />,
  [TaskPriority.Critical]: <MdDangerous className="text-red-600" />,
};

export const taskIcons: Record<TaskType, ReactNode> = {
  [TaskType.Story]: <RiBookFill className="text-emerald-500" />,
  [TaskType.Task]: <FaClipboardCheck className="text-blue-500" />,
  [TaskType.Bug]: <FaBug className="text-red-500" />,
  [TaskType.Epic]: <FaDiamond className="text-purple-500" />,
  [TaskType.SubTask]: <FaClipboardCheck className="text-green-500" />,
};
