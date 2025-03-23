"use client";

import useSprintsByProjectId from "@/hooks/api/sprint/useSprintsByProjectId";
import useEpics from "@/hooks/api/task/useEpics";
import { useParams } from "next/navigation";
import React from "react";
export default function ProjectTimeLinePage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: epics, isPending: isEpicsPending, isError: isEpicsError } = useEpics(projectId);
  const { data: sprints, isPending: isSprintsPending, isError: isSprintsError } = useSprintsByProjectId(projectId);

  if (isEpicsPending || isSprintsPending) {
    return <div>Loading...</div>;
  }

  if (isEpicsError || isSprintsError) {
    return <div>Error loading data</div>;
  }

  return <div>ProjectTimeLinePage</div>;
}
