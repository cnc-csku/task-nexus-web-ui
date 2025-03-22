"use client";

import BackLogTasksList from "./BackLogTasksList";
import { Project } from "@/interfaces/Project";
import { Task } from "@/interfaces/Task";
import SprintsList from "./SprintsList";
import CreateTaskModal from "./CreateTaskModal";
import { useDisclosure } from "@heroui/modal";
import { TaskLevel, TaskType } from "@/enums/Task";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";
import useUpdateTaskSprint from "@/hooks/api/task/useUpdateTaskSprint";
import { getApiErrorMessage } from "@/utils/errutils";
import { toast } from "sonner";
import LoadingScreen from "../ui/LoadingScreen";

interface BackLogDataProps {
  project: Project;
  selectedEpic: string | null;
  selectedAssignees: string[];
  selectedPositions: string[];
  selectedStatuses: string[];
  search: string;
  allEpics: Task[];
  onOpenSideTaskDetail: (taskId: string) => void;
}

export default function BackLogData({
  project,
  selectedEpic,
  selectedAssignees,
  selectedPositions,
  selectedStatuses,
  search,
  allEpics,
  onOpenSideTaskDetail,
}: BackLogDataProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isShowDropArea, setIsShowDropArea] = useState<boolean>(false);
  const [hoverOverId, setHoverOverId] = useState<string>("");
  const [defaultParentId, setDefaultParentId] = useState<string | null>(null);
  const [defaultSprintId, setDefaultSprintId] = useState<string | null>(null);

  const { mutateAsync, isPending } = useUpdateTaskSprint(project.id);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const sensors = useSensors(mouseSensor);

  const onOpenCreateTaskModal = (
    defaultSprintId: string | null,
    defaultParentId: string | null
  ) => {
    setDefaultParentId(defaultParentId);
    setDefaultSprintId(defaultSprintId);

    onOpen();
  };

  const onChangeSprintDrop = async (event: DragEndEvent) => {
    setHoverOverId("");

    setIsShowDropArea(false);

    if (!event.over?.id) {
      return;
    }

    if (event.active.id === event.over.id) {
      return;
    }

    if (event.active.data.current?.currentSprint === event.over.id) {
      return;
    }

    try {
      await mutateAsync({
        taskRef: event.active.id.toString(),
        currentSprintId: event.over.id.toString() === "BACKLOG" ? null : event.over.id.toString(),
      });

      toast.success("Update task sprint successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const onDragStart = () => {
    setIsShowDropArea(true);
  };

  const onDragOver = (event: DragOverEvent) => {
    if (!event.over?.id) {
      return;
    }

    if (hoverOverId === event.over?.id.toString()) {
      return;
    }

    setHoverOverId(event.over?.id.toString());
  };

  return (
    <>
      {isPending && <LoadingScreen />}
      <CreateTaskModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        parents={allEpics}
        taskLevel={TaskLevel.Level1}
        projectId={project.id}
        defaultParentId={defaultParentId}
        defaultSprintId={defaultSprintId}
      />
      <div className="max-h-[calc(100vh-9rem)] overflow-y-scroll scrollbar-hide pb-2">
        <DndContext
          onDragEnd={onChangeSprintDrop}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          sensors={sensors}
        >
          <SprintsList
            project={project}
            selectedEpic={selectedEpic}
            selectedAssignees={selectedAssignees}
            selectedPositions={selectedPositions}
            selectedStatuses={selectedStatuses}
            search={search}
            allEpics={allEpics}
            isShowDropArea={isShowDropArea}
            hoverOverId={hoverOverId}
            onOpenSideTaskDetail={onOpenSideTaskDetail}
            onOpenCreateTaskModal={onOpenCreateTaskModal}
          />
          <BackLogTasksList
            project={project}
            selectedEpic={selectedEpic}
            selectedAssignees={selectedAssignees}
            selectedPositions={selectedPositions}
            selectedStatuses={selectedStatuses}
            search={search}
            allEpics={allEpics}
            isShowDropArea={isShowDropArea}
            hoverOverId={hoverOverId}
            onOpenSideTaskDetail={onOpenSideTaskDetail}
            onOpenCreateTaskModal={onOpenCreateTaskModal}
          />
        </DndContext>
      </div>
    </>
  );
}
