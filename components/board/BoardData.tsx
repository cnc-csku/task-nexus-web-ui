"use client";

import { Project } from "@/interfaces/Project";
import BoardLanes from "./BoardLanes";
import useTasksByFilter from "@/hooks/api/task/useTasksByFilter";
import LoadingScreen from "../ui/LoadingScreen";
import { Sprint } from "@/interfaces/Sprint";
import { TaskType } from "@/enums/Task";
import TaskDetailModal from "../task/TaskDetailModal";
import { useDisclosure } from "@heroui/modal";
import { SprintStatus } from "@/enums/Sprint";
import useFindProjectById from "@/hooks/api/project/useFindProjectById";
import useTaskByRef from "@/hooks/api/task/useTaskDetailByRef";
import useSprintsByProjectId from "@/hooks/api/sprint/useSprintsByProjectId";
import useAllProjectMembers from "@/hooks/api/project/useAllProjectMembers";
import { useState } from "react";
import { Task } from "@/interfaces/Task";
import useEpics from "@/hooks/api/task/useEpics";

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

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [task, setTask] = useState<Task | null>(null);

  const {
    data: members,
    isPending: isMembersPending,
    error: membersError,
  } = useAllProjectMembers(project.id, 20);

  const {
    data: sprints,
    isPending: isSprintsPending,
    error: sprintsError,
  } = useSprintsByProjectId(project.id, {
    statuses: [SprintStatus.Created, SprintStatus.InProgress],
  });

  const { data: allEpics, isPending: isEpicsPending, error: epicsError } = useEpics(project.id);

  if (isTasksPending || isMembersPending || isSprintsPending || isEpicsPending) {
    return <LoadingScreen />;
  }

  if (tasksError) {
    return <div>Error: {tasksError.message}</div>;
  }

  if (membersError) {
    return <div>Error: {membersError.message}</div>;
  }

  if (sprintsError) {
    return <div>Error: {sprintsError.message}</div>;
  }

  if (epicsError) {
    return <div>Error: {epicsError.message}</div>;
  }

  const onOpenTaskDetailModal = (task: Task) => {
    setTask(task);
    onOpen();
  };

  return (
    <div>
      {task && (
        <TaskDetailModal
          project={project}
          taskRef={task.taskRef}
          members={members}
          sprints={sprints}
          allEpics={allEpics}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
      )}
      <BoardLanes
        project={project}
        currentSprints={currentSprints}
        workflows={project.workflows}
        statuses={statuses}
        tasks={tasks}
        onOpenTaskDetailModal={onOpenTaskDetailModal}
      />
    </div>
  );
}
