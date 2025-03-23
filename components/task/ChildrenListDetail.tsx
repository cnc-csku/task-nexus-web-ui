"use client";

import useTaskChildren from "@/hooks/api/task/useTaskChildren";
import { Project } from "@/interfaces/Project";
import LoadingScreen from "../ui/LoadingScreen";
import ChildrenListItem from "./ChildrenListItem";

export interface ChidrenListDetailProps {
  project: Project;
  taskRef: string;
  compact?: boolean;
}

export default function ChildrenListDetail({ project, taskRef, compact }: ChidrenListDetailProps) {
  const {
    data: childrenTasks,
    isPending: isChildrenTasksPending,
    error: childrenTasksError,
  } = useTaskChildren(project.id, { parentTaskRef: taskRef });

  if (isChildrenTasksPending) {
    return <LoadingScreen />;
  }

  if (childrenTasksError) {
    return <div>{childrenTasksError.message}</div>;
  }

  return (
    <div className="space-y-2">
      {childrenTasks.map((task) => (
        <ChildrenListItem key={task.taskRef} projectId={project.id} task={task} compact={compact} />
      ))}
    </div>
  );
}
