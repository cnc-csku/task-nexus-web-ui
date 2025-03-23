import useAllProjectMembers from "@/hooks/api/project/useAllProjectMembers";
import ProjectMembersTable from "./ProjectMembersTable";
import LoadingScreen from "../ui/LoadingScreen";
import ProjectInvitation from "./ProjectInvitation";
import useFindProjectById from "@/hooks/api/project/useFindProjectById";

interface ProjectMembersSettingProps {
  projectId: string;
}

export default function ProjectMembersSetting({ projectId }: ProjectMembersSettingProps) {
  const {
    data: projectMembers,
    isPending: isPendingProjectMembers,
    error: errorProjectMembers,
  } = useAllProjectMembers(projectId, 20);
  const {
    data: project,
    isPending: isPendingProject,
    error: errorProject,
  } = useFindProjectById(projectId);

  if (isPendingProjectMembers || isPendingProject) {
    return <LoadingScreen />;
  }

  if (errorProjectMembers) {
    return <div>Error: {errorProjectMembers.message}</div>;
  }

  if (errorProject) {
    return <div>Error: {errorProject.message}</div>;
  }

  return (
    <div>
      <ProjectInvitation
        project={project}
        projectMembers={projectMembers}
      />
      <ProjectMembersTable projectMembers={projectMembers} />
    </div>
  );
}
