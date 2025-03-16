"use client";

import { useParams } from "next/navigation";
import LoadingScreen from "@/components/ui/LoadingScreen";
import useFindProjectById from "@/hooks/api/project/useFindProjectById";
import BackLog from "@/components/task/BackLog";
import useAllProjectMembers from "@/hooks/api/project/useAllProjectMembers";
import useEpics from "@/hooks/api/task/useEpics";

export default function ProjectTaskPage() {
  const { projectId } = useParams<{ projectId: string }>();

  const {
    data: project,
    isPending: isProjectPending,
    error: projectError,
  } = useFindProjectById(projectId);

  const {
    data: members,
    isPending: isMemberPeding,
    error: memberError,
  } = useAllProjectMembers(projectId, 20);

  const { data: epics, isPending: isEpicsPending, error: epicsError } = useEpics(projectId);

  if (isProjectPending || isMemberPeding || isEpicsPending) {
    return <LoadingScreen />;
  }

  if (projectError) {
    return <div>Error: {projectError.message}</div>;
  }

  if (memberError) {
    return <div>Error: {memberError.message}</div>;
  }

  if (epicsError) {
    return <div>Error: {epicsError.message}</div>;
  }

  return (
    <BackLog
      members={members}
      project={project}
      epics={epics}
    />
  );
}
