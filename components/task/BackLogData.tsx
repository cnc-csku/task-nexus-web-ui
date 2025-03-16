"use client";

import BackLogTasksList from "./BackLogTasksList";
import { Project } from "@/interfaces/Project";
import { Task } from "@/interfaces/Task";
import SprintsList from "./SprintsList";

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
  return (
    <>
      <SprintsList
        project={project}
        selectedEpic={selectedEpic}
        selectedAssignees={selectedAssignees}
        selectedPositions={selectedPositions}
        selectedStatuses={selectedStatuses}
        search={search}
        allEpics={allEpics}
        onOpenSideTaskDetail={onOpenSideTaskDetail}
      />
      <BackLogTasksList
        project={project}
        selectedEpic={selectedEpic}
        selectedAssignees={selectedAssignees}
        selectedPositions={selectedPositions}
        selectedStatuses={selectedStatuses}
        search={search}
        allEpics={allEpics}
        onOpenSideTaskDetail={onOpenSideTaskDetail}
      />
    </>
  );
}
