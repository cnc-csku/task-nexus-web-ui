"use client";

import Header from "@/components/ui/Header";
import TaskCard from "@/components/board/TaskCard";
import Board from "@/components/board/Board";
import useFindProjectById from "@/hooks/api/project/useFindProjectById";
import { useParams } from "next/navigation";
import LoadingScreen from "@/components/ui/LoadingScreen";
import useProjectMembers from "@/hooks/api/project/useProjectMembers";
import useAllProjectMembers from "@/hooks/api/project/useAllProjectMembers";
import useSprintsByProjectId from "@/hooks/api/sprint/useSprintsByProjectId";
import { SprintStatus } from "@/enums/Sprint";

export default function BoardPage() {
  const { projectId } = useParams<{ projectId: string }>();

  const {
    data: projects,
    isPending: isProjectsPending,
    error: projectsError,
  } = useFindProjectById(projectId);

  const {
    data: projectMembers,
    isPending: isProjectMembersPending,
    error: projectMembersError,
  } = useAllProjectMembers(projectId, 20);

  const {
    data: currentSprints,
    isPending: isSprintsPending,
    error: sprintsError,
  } = useSprintsByProjectId(projectId, {
    statuses: [SprintStatus.InProgress],
  });

  if (isProjectsPending || isProjectMembersPending || isSprintsPending) {
    return <LoadingScreen />;
  }

  if (projectsError) {
    return <div>Error: {projectsError.message}</div>;
  }

  if (projectMembersError) {
    return <div>Error: {projectMembersError.message}</div>;
  }

  if (sprintsError) {
    return <div>Error: {sprintsError.message}</div>;
  }

  return (
    <div>
      <Board
        members={projectMembers}
        positions={projects.positions}
        statuses={projects.workflows.map(({ status }) => status)}
        project={projects}
        currentSprints={currentSprints}
      />

      {/* <SprintGoalModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      /> */}
    </div>
  );
}
