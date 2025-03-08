"use client";

import ProjectsTable from "@/components/project/ProjectsTable";
import ProjectsTableHeader from "@/components/project/ProjectsTableHeader";
import LoadingScreen from "@/components/ui/LoadingScreen";
import useMyProjects from "@/hooks/api/project/useMyProjects";
import { useParams } from "next/navigation";

export default function WorkspaceProjectsPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const { data: projects, isPending, error } = useMyProjects(workspaceId);

  if (isPending) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="px-3 py-2">
      <div className="container mx-auto grid gap-4">
        <h1 className="text-2xl font-semibold">My Projects</h1>
        <ProjectsTableHeader workspaceId={workspaceId} />
        <ProjectsTable projects={projects} />
      </div>
    </div>
  );
}
