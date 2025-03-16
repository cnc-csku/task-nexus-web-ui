"use client";

import { Project, ProjectMember } from "@/interfaces/Project";
import TaskFilter from "./TaskFilter";
import { useEffect, useState } from "react";
import SideEpics from "./SideEpics";
import { Task } from "@/interfaces/Task";
import BackLogData from "./BackLogData";
import SideTaskDetail from "./SideTaskDetail";

export interface BackLogProps {
  project: Project;
  members: ProjectMember[];
  epics: Task[];
}

export default function BackLog({ project, members, epics }: BackLogProps) {
  const [isShowEpics, setIsShowEpics] = useState(false);
  const [selectedEpic, setSelectedEpic] = useState<string | null>(null);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
    project.workflows.map(({ status }) => status)
  );
  const [search, setSearch] = useState<string>("");

  const [isShowSideTaskDetail, setIsShowSideTaskDetail] = useState<boolean>(false);
  const [SideTaskRef, setSideTaskRef] = useState<string | null>(null);

  const handleCloseSideTaskDetail = () => {
    setIsShowSideTaskDetail(false);
  };

  const handleOpenSideTaskDetail = (taskRef: string) => {
    setSideTaskRef(taskRef);
    setIsShowSideTaskDetail(true);
  };

  return (
    <div className="grid grid-cols-7">
      <div className="col-span-7 transition-all">
        <TaskFilter
          members={members}
          positions={project.positions}
          statuses={project.workflows.map(({ status }) => status)}
          search={search}
          setSearch={setSearch}
          isShowEpics={isShowEpics}
          setShowIsEpics={setIsShowEpics}
          selectedPositions={selectedPositions}
          setSelectedPositions={setSelectedPositions}
          selectedAssignees={selectedAssignees}
          setSelectedAssignees={setSelectedAssignees}
          selectedStatuses={selectedStatuses}
          setSelectedStatuses={setSelectedStatuses}
        />
      </div>

      <div className={`${isShowSideTaskDetail == true ? "col-span-5" : "col-span-7"}`}>
        <div className="grid gap-4 grid-cols-12">
          {isShowEpics && (
            <div className="col-span-3">
              <SideEpics
                projectId={project.id}
                selectedEpic={selectedEpic}
                setSelectedEpic={setSelectedEpic}
                epics={epics}
              />
            </div>
          )}
          <div className={isShowEpics ? "col-span-9" : "col-span-12"}>
            <BackLogData
              project={project}
              selectedEpic={selectedEpic}
              selectedAssignees={selectedAssignees}
              selectedPositions={selectedPositions}
              selectedStatuses={selectedStatuses}
              search={search}
              onOpenSideTaskDetail={handleOpenSideTaskDetail}
              allEpics={epics}
            />
          </div>
        </div>
      </div>
      <div className={`${isShowSideTaskDetail == true ? "col-span-2" : "hidden"} transition-all`}>
        {SideTaskRef && (
          <SideTaskDetail
            isOpen={isShowSideTaskDetail}
            onClose={() => handleCloseSideTaskDetail()}
            projectId={project.id}
            taskRef={SideTaskRef}
            allEpics={epics}
          />
        )}
      </div>
    </div>
  );
}
