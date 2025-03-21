"use client";

import useSprintsByProjectId from "@/hooks/api/sprint/useSprintsByProjectId";
import { Accordion, AccordionItem } from "@heroui/accordion";
import LoadingScreen from "../ui/LoadingScreen";
import { Project } from "@/interfaces/Project";
import { Task } from "@/interfaces/Task";
import SprintItem from "./SprintItem";
import SprintHeader from "./SprintHeader";
import { Button } from "@heroui/button";
import { AiOutlinePlus } from "react-icons/ai";
import useCreateSprint from "@/hooks/api/sprint/useCreateSprint";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/errutils";
import SprintTaskList from "./SprintTaskList";

export interface SprintsListProps {
  project: Project;
  selectedEpic: string | null;
  selectedAssignees: string[];
  selectedPositions: string[];
  selectedStatuses: string[];
  search: string;
  allEpics: Task[];
  isShowDropArea: boolean;
  hoverOverId: string;
  onOpenSideTaskDetail: (taskId: string) => void;
  onOpenCreateTaskModal: (defaultSprintId: string | null, defaultParentId: string | null) => void;
}

export default function SprintsList({
  project,
  selectedEpic,
  selectedAssignees,
  selectedPositions,
  selectedStatuses,
  search,
  allEpics,
  isShowDropArea,
  hoverOverId,
  onOpenSideTaskDetail,
  onOpenCreateTaskModal,
}: SprintsListProps) {
  const {
    data: sprints,
    isPending: isSprintPending,
    error: sprintError,
  } = useSprintsByProjectId(project.id);

  const { mutateAsync: createSprintMutateAsync, isPending: isCreateSprintPending } =
    useCreateSprint(project.id);

  if (isSprintPending) {
    return <LoadingScreen />;
  }

  if (sprintError) {
    return <div>Error: {sprintError.message}</div>;
  }

  const handleCreateSprint = async () => {
    try {
      await createSprintMutateAsync();

      toast.success("Create new sprint successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="space-y-3">
      {sprints.map((sprint) => (
        <SprintTaskList
          key={sprint.id}
          project={project}
          sprint={sprint}
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
      ))}

      <div className="w-full px-2">
        <Button
          className="w-full justify-start"
          color="primary"
          variant="light"
          startContent={<AiOutlinePlus className="text-lg" />}
          onPress={handleCreateSprint}
        >
          Create Sprint
        </Button>
      </div>
    </div>
  );
}
