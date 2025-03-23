"use client";

import { Project } from "@/interfaces/Project";
import BoardLanes from "./BoardLanes";
import useTasksByFilter from "@/hooks/api/task/useTasksByFilter";
import LoadingScreen from "../ui/LoadingScreen";
import { Sprint } from "@/interfaces/Sprint";
import { TaskType } from "@/enums/Task";

export interface BoardProps {
  project: Project;
  currentSprints: Sprint[];
  statuses: string[];
  search: string;
  selectedPositions: string[];
  selectedAssignees: string[];
  selectedStatuses: string[];
}

export default function BoardData({
  project,
  currentSprints,
  statuses,
  search,
  selectedPositions,
  selectedAssignees,
  selectedStatuses,
}: BoardProps) {
  const {
    data: tasks,
    isPending: isTasksPending,
    error: tasksError,
  } = useTasksByFilter(project.id, {
    positions: selectedPositions.length > 0 ? selectedPositions : null,
    userIds: selectedPositions.length > 0 ? null : selectedAssignees,
    searchKeyword: search,
    statuses: selectedStatuses,
    sprintIds: currentSprints.map(({ id }) => id),
    types: [TaskType.Task, TaskType.Bug, TaskType.Story, TaskType.SubTask],
  });

  if (isTasksPending) {
    return <LoadingScreen />;
  }

  if (tasksError) {
    return <div>Error: {tasksError.message}</div>;
  }

  return (
    <div>
      <BoardLanes
        project={project}
        currentSprints={currentSprints}
        workflows={project.workflows}
        statuses={statuses}
        tasks={tasks}
      />
    </div>
  );
}
