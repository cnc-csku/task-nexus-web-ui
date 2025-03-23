"use client";

import TaskDetail from "@/components/task/TaskDetail";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { SprintStatus } from "@/enums/Sprint";
import useAllProjectMembers from "@/hooks/api/project/useAllProjectMembers";
import useFindProjectById from "@/hooks/api/project/useFindProjectById";
import useSprintsByProjectId from "@/hooks/api/sprint/useSprintsByProjectId";
import useEpics from "@/hooks/api/task/useEpics";
import useTaskByRef from "@/hooks/api/task/useTaskDetailByRef";
import { useParams } from "next/navigation";

export default function TaskDetailPage() {
  const { projectId, taskRef } = useParams<{ projectId: string; taskRef: string }>();

  const {
    data: project,
    isPending: isProjectPending,
    error: projectError,
  } = useFindProjectById(projectId);
  const {
    data: task,
    isPending: isTaskPending,
    error: taskError,
  } = useTaskByRef(projectId, taskRef);

  const {
    data: members,
    isPending: isMembersPending,
    error: membersError,
  } = useAllProjectMembers(projectId, 20);

  const {
    data: sprints,
    isPending: isSprintsPending,
    error: sprintsError,
  } = useSprintsByProjectId(projectId, {
    statuses: [SprintStatus.Created, SprintStatus.InProgress],
  });

  const { data: epics, isPending: isEpicsPending, error: epicsError } = useEpics(projectId);

  if (isTaskPending || isProjectPending || isMembersPending || isSprintsPending || isEpicsPending) {
    return <LoadingScreen />;
  }

  if (taskError) {
    return <div>Error: {taskError.message}</div>;
  }

  if (projectError) {
    return <div>Error: {projectError.message}</div>;
  }

  if (membersError) {
    return <div>Error: {membersError.message}</div>;
  }

  if (sprintsError) {
    return <div>Error: {sprintsError.message}</div>;
  }

  if (epicsError) {
    return <div>Error: {epicsError.message}</div>;
  }

  if (!task) {
    return <div>Task not found</div>;
  }

  return (
    <div className="h-[calc(100vh-6rem)] overflow-scroll scrollbar-hide">
      <TaskDetail
        task={task}
        project={project}
        members={members}
        sprints={sprints}
        allEpics={epics}
      />
    </div>
  );
}
