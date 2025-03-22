import { Task } from "@/interfaces/Task";
import { Sprint } from "@/interfaces/Sprint";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import Lane from "./Lane";
import { useState } from "react";
import { Project, Workflow } from "@/interfaces/Project";
import useUpdateTaskStatus from "@/hooks/api/task/useUpdateTaskStatus";
import { toast } from "sonner";

export interface BoardLanesProps {
  project: Project;
  tasks: Task[];
  statuses: string[];
  workflows: Workflow[];
  currentSprints: Sprint[];
}

export default function BoardLanes({
  project,
  tasks,
  statuses,
  workflows,
  currentSprints,
}: BoardLanesProps) {
  const [draggingTaskRef, setDraggingTaskRef] = useState<string | null>(null);
  const [draggingTaskStatus, setDraggingTaskStatus] = useState<string | null>(null);
  const [availableStatuses, setAvailableStatuses] = useState<string[]>([]);
  const [draggingOverStatus, setDraggingOverStatus] = useState<string | null>(null);

  const { mutateAsync: updateTaskStatus, isPending: isUpdateTaskStatusPending } =
    useUpdateTaskStatus(project.id, draggingTaskRef || "");

  const taskStatusMap: Map<string, Task[]> = new Map<string, Task[]>();

  tasks.forEach((task) => {
    const status = task.status;
    const tasks = taskStatusMap.get(status) || [];
    tasks.push(task);
    taskStatusMap.set(status, tasks);
  });

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5,
    },
  });

  const sensors = useSensors(mouseSensor);

  const getAvailableStatuses = (status: string): string[] => {
    const availableStatuses: string[] = [];

    workflows.forEach((workflow) => {
      if (workflow.status === status) {
        workflow.previousStatuses?.forEach((previousStatus) => {
          availableStatuses.push(previousStatus);
        });
      }

      if (workflow.previousStatuses?.includes(status)) {
        availableStatuses.push(workflow.status);
      }
    });

    return availableStatuses;
  };

  const onDragEnd = async (event: DragEndEvent) => {
    if (!event.over) {
      return;
    }

    if (draggingTaskStatus !== event.over.id) {
      const targetStatus = event.over.id as string;

      if (!availableStatuses.includes(targetStatus)) {
        return;
      }

      await updateTaskStatus({
        status: targetStatus,
      });

      toast.success("Task status updated successfully");
    }

    setDraggingTaskRef(null);
    setDraggingTaskStatus(null);
    setAvailableStatuses([]);
    setDraggingOverStatus(null);
  };

  const onDragStart = (event: DragStartEvent) => {
    if (!event.active.data.current) {
      return;
    }

    const status = event.active.data.current.status;
    const availableStatuses = getAvailableStatuses(status);

    setAvailableStatuses(availableStatuses);
    setDraggingTaskRef(event.active.id as string);
    setDraggingTaskStatus(status);
  };

  const onDragOver = (event: DragOverEvent) => {
    if (!event.over) {
      return;
    }

    const targetStatus = event.over.id as string;

    if (!availableStatuses.includes(targetStatus) && draggingTaskStatus !== targetStatus) {
      return;
    }

    setDraggingOverStatus(targetStatus);
  };

  return (
    <div>
      <div className={`grid grid-cols-${statuses.length} gap-4 mb-3`}>
        {statuses.map((status) => (
          <div
            key={status}
            className="flex flex-col"
          >
            <div className="flex items-center justify-between py-2 px-3  bg-gray-50 rounded-lg">
              <span>{status}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="h-[calc(100vh-13rem)] overflow-y-scroll scrollbar-hide">
        <div className={`grid grid-cols-${statuses.length} gap-4 h-full`}>
          <DndContext
            sensors={sensors}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
          >
            {/* Board cards */}
            {statuses.map((status) => {
              const tasksForStatus = taskStatusMap.get(status) || [];

              return (
                <Lane
                  draggingTaskRef={draggingTaskRef}
                  draggingTaskStatus={draggingTaskStatus}
                  key={status}
                  status={status}
                  tasks={tasksForStatus}
                  isDraggingOver={draggingOverStatus === status}
                  availableStatuses={availableStatuses}
                />
              );
            })}
          </DndContext>
        </div>
      </div>
    </div>
  );
}
