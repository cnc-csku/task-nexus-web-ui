"use client";

import useTaskByRef from "@/hooks/api/task/useTaskDetailByRef";
import LoadingScreen from "../ui/LoadingScreen";
import ChildrenListItem from "./ChildrenListItem";

export interface ParentListProps {
  taskId: string;
  projectId: string;
}

export default function ParentList({ taskId, projectId }: ParentListProps) {
  const { data: task, isPending, error } = useTaskByRef(projectId, taskId);
  if (isPending) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <ChildrenListItem
      task={task}
      projectId={projectId}
    />
  );
}
