import { Project } from "@/interfaces/Project";
import { Sprint } from "@/interfaces/Sprint";
import { Task } from "@/interfaces/Task";
import { Accordion, AccordionItem } from "@heroui/accordion";
import SprintHeader from "./SprintHeader";
import SprintItem from "./SprintItem";
import { useDroppable } from "@dnd-kit/core";
import { SprintStatus } from "@/enums/Sprint";

export interface SprintTaskListProps {
  project: Project;
  sprint: Sprint;
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
  onOpenChangeUpdateSprintStatusModal: (sprint: Sprint, toStatus: SprintStatus) => void;
  onOpenSprintGoalModal: (sprint: Sprint) => void;
  onOpenChangeEditSprintModal: (sprint: Sprint) => void;
}

export default function SprintTaskList({
  project,
  sprint,
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
  onOpenChangeUpdateSprintStatusModal,
  onOpenSprintGoalModal,
  onOpenChangeEditSprintModal,
}: SprintTaskListProps) {
  const { setNodeRef } = useDroppable({
    id: sprint.id,
  });

  return (
    <Accordion
      selectionMode="multiple"
      variant="splitted"
      ref={setNodeRef}
    >
      <AccordionItem
        key={sprint.id}
        aria-label={sprint.title}
        className={`shadow-none border ${isShowDropArea ? "border-dashed border-gray-300" : ""} ${
          hoverOverId === sprint.id ? "border-black" : ""
        }`}
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
          onOpenChangeUpdateSprintStatusModal={onOpenChangeUpdateSprintStatusModal}
          onOpenSideTaskDetail={onOpenSideTaskDetail}
          onOpenCreateTaskModal={onOpenCreateTaskModal}
          onOpenSprintGoalModal={onOpenSprintGoalModal}
          onOpenChangeEditSprintModal={onOpenChangeEditSprintModal}
        />
      </AccordionItem>
    </Accordion>
  );
}
