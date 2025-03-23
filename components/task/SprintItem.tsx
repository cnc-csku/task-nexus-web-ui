"use client";

import { Project } from "@/interfaces/Project";
import { Task } from "@/interfaces/Task";
import { Sprint } from "@/interfaces/Sprint";
import SprintActions from "./SprintActions";
import useTasksByFilter from "@/hooks/api/task/useTasksByFilter";
import TaskListItem from "./TaskListItem";
import { AiOutlinePlus } from "react-icons/ai";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { SprintStatus } from "@/enums/Sprint";
import { TaskType } from "@/enums/Task";

export interface SprintsListProps {
  project: Project;
  sprint: Sprint;
  selectedEpic: string | null;
  selectedAssignees: string[];
  selectedPositions: string[];
  selectedStatuses: string[];
  search: string;
  allEpics: Task[];
  onOpenSideTaskDetail: (taskId: string) => void;
  onOpenCreateTaskModal: (defaultSprintId: string | null, defaultParentId: string | null) => void;
  onOpenChangeUpdateSprintStatusModal: (sprint: Sprint, toStatus: SprintStatus) => void;
  onOpenSprintGoalModal: (sprint: Sprint) => void;
  onOpenChangeEditSprintModal: (sprint: Sprint) => void;
}

export default function SprintItem({
  project,
  sprint,
  selectedEpic,
  selectedAssignees,
  selectedPositions,
  selectedStatuses,
  search,
  allEpics,
  onOpenSideTaskDetail,
  onOpenCreateTaskModal,
  onOpenChangeUpdateSprintStatusModal,
  onOpenSprintGoalModal,
  onOpenChangeEditSprintModal,
}: SprintsListProps) {
  const {
    data: tasks,
    isPending: isTaskPending,
    error: taskError,
  } = useTasksByFilter(project.id, {
    positions: selectedPositions.length > 0 ? selectedPositions : null,
    userIds: selectedPositions.length > 0 ? null : selectedAssignees,
    searchKeyword: search,
    statuses: selectedStatuses,
    epicTaskId: selectedEpic ?? undefined,
    sprintIds: [sprint.id],
    types: [TaskType.Task, TaskType.Bug, TaskType.Story],
  });

  if (taskError) {
    return <div>Error: {taskError.message}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        {isTaskPending ? (
          <Spinner />
        ) : (
          <>
            <div className="mb-2">
              <SprintActions
                sprint={sprint}
                onOpenChangeUpdateSprintStatusModal={onOpenChangeUpdateSprintStatusModal}
                onOpenSprintGoalModal={onOpenSprintGoalModal}
                onOpenChangeEditSprintModal={onOpenChangeEditSprintModal}
              />
            </div>
            {tasks.map((task) => (
              <TaskListItem
                key={task.id}
                projectId={project.id}
                workflows={project.workflows}
                task={task}
                onOpenSideTaskDetail={onOpenSideTaskDetail}
                allEpics={allEpics}
              />
            ))}
            <Button
              className="w-full justify-start"
              color="primary"
              variant="light"
              startContent={<AiOutlinePlus className="text-lg" />}
              onPress={() => onOpenCreateTaskModal(sprint.id, null)}
            >
              Create Task
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
