"use client";

import { useState } from "react";
import TaskFilter from "../task/TaskFilter";
import { Project, ProjectMember } from "@/interfaces/Project";
import { Sprint } from "@/interfaces/Sprint";
import BoardData from "./BoardData";

export interface BoardProps {
  project: Project;
  members: ProjectMember[];
  positions: string[];
  statuses: string[];
  currentSprints: Sprint[];
}

export default function Board({
  project,
  members,
  positions,
  statuses,
  currentSprints,
}: BoardProps) {
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
    project.workflows.map(({ status }) => status)
  );
  const [search, setSearch] = useState<string>("");

  return (
    <div>
      <TaskFilter
        members={members}
        positions={positions}
        statuses={statuses}
        search={search}
        setSearch={setSearch}
        selectedPositions={selectedPositions}
        setSelectedPositions={setSelectedPositions}
        selectedAssignees={selectedAssignees}
        setSelectedAssignees={setSelectedAssignees}
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
      />
      <BoardData
        project={project}
        currentSprints={currentSprints}
        statuses={statuses}
        search={search}
        selectedPositions={selectedPositions}
        selectedAssignees={selectedAssignees}
        selectedStatuses={selectedStatuses}
      />
    </div>
  );
}
