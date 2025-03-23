"use client";

import { useState } from "react";
import TaskFilter from "../task/TaskFilter";
import { Project, ProjectMember } from "@/interfaces/Project";
import BoardLanes from "./BoardLanes";
import useTasksByFilter from "@/hooks/api/task/useTasksByFilter";
import LoadingScreen from "../ui/LoadingScreen";
import { Sprint } from "@/interfaces/Sprint";
import { TaskType } from "@/enums/Task";

export interface BoardProps {
  project: Project;
  members: ProjectMember[];
  positions: string[];
  statuses: string[];
  currentSprints: Sprint[];
}

export default function Board({
  project,
  members,
  positions,
  statuses,
  currentSprints,
}: BoardProps) {
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
    project.workflows.map(({ status }) => status)
  );
  const [search, setSearch] = useState<string>("");

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
      <TaskFilter
        members={members}
        positions={positions}
        statuses={statuses}
        search={search}
        setSearch={setSearch}
        selectedPositions={selectedPositions}
        setSelectedPositions={setSelectedPositions}
        selectedAssignees={selectedAssignees}
        setSelectedAssignees={setSelectedAssignees}
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
      />
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
