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
              <SprintActions sprint={sprint} />
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
