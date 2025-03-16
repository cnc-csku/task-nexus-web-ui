"use client";

import { Accordion, AccordionItem } from "@heroui/accordion";
import TaskListItem from "./TaskListItem";
import useTasksByFilter from "@/hooks/api/task/useTasksByFilter";
import TaskListSkeleton from "./TaskListSkeleton";
import { Project } from "@/interfaces/Project";
import { Task } from "@/interfaces/Task";
import { Button } from "@heroui/button";
import { AiOutlinePlus } from "react-icons/ai";

export interface BackLogTasksListProps {
  project: Project;
  selectedEpic: string | null;
  selectedAssignees: string[];
  selectedPositions: string[];
  selectedStatuses: string[];
  search: string;
  allEpics: Task[];
  onOpenSideTaskDetail: (taskId: string) => void;
}

export default function BackLogTasksList({
  project,
  selectedEpic,
  selectedAssignees,
  selectedPositions,
  selectedStatuses,
  search,
  allEpics,
  onOpenSideTaskDetail,
}: BackLogTasksListProps) {
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
    sprintId: "BACKLOG",
  });

  if (isTaskPending) {
    return <TaskListSkeleton />;
  }

  if (taskError) {
    return <div>Error: {taskError.message}</div>;
  }

  return (
    <>
      <Accordion
        selectionMode="single"
        variant="splitted"
        className="mt-3"
        defaultExpandedKeys={["backlog"]}
      >
        <AccordionItem
          key="backlog"
          aria-label="backlog"
          className="shadow-none border"
          title={
            <div className="flex justify-between items-center">
              <div>Backlog</div>
            </div>
          }
        >
          <div className="grid gap-2">
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
            >
              Create Task
            </Button>
          </div>
        </AccordionItem>
      </Accordion>
    </>
  );
}
