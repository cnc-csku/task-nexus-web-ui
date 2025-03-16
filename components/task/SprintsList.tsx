"use client";

import useSprintsByProjectId from "@/hooks/api/sprint/useSprintsByProjectId";
import { Accordion, AccordionItem } from "@heroui/accordion";
import LoadingScreen from "../ui/LoadingScreen";
import { useState } from "react";
import { Project } from "@/interfaces/Project";
import { Task } from "@/interfaces/Task";
import SprintItem from "./SprintItem";
import SprintHeader from "./SprintHeader";
import { Button } from "@heroui/button";
import { AiOutlinePlus } from "react-icons/ai";
import useCreateSprint from "@/hooks/api/sprint/useCreateSprint";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/errutils";

export interface SprintsListProps {
  project: Project;
  selectedEpic: string | null;
  selectedAssignees: string[];
  selectedPositions: string[];
  selectedStatuses: string[];
  search: string;
  allEpics: Task[];
  onOpenSideTaskDetail: (taskId: string) => void;
}

export default function SprintsList({
  project,
  selectedEpic,
  selectedAssignees,
  selectedPositions,
  selectedStatuses,
  search,
  allEpics,
  onOpenSideTaskDetail,
}: SprintsListProps) {
  const [selectedSprints, setSelectedSprints] = useState<string[]>([]);

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
      <Accordion
        selectionMode="multiple"
        variant="splitted"
        defaultSelectedKeys={selectedSprints}
      >
        {sprints.map((sprint) => (
          <AccordionItem
            key={sprint.id}
            aria-label={sprint.title}
            className="shadow-none border"
            title={<SprintHeader sprint={sprint} />}
          >
            <SprintItem
              project={project}
              sprint={sprint}
              selectedEpic={selectedEpic}
              selectedAssignees={selectedAssignees}
              selectedPositions={selectedPositions}
              selectedStatuses={selectedStatuses}
              search={search}
              allEpics={allEpics}
              onOpenSideTaskDetail={onOpenSideTaskDetail}
            />
          </AccordionItem>
        ))}
      </Accordion>
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
