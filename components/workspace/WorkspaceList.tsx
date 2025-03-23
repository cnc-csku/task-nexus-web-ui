import { MyWorkspace } from "@/interfaces/Workspace";
import WorkspaceItem from "./WorkspaceItem";
import { WorkspaceMemberRole } from "@/enums/Workspace";

interface WorkspaceListProps {
  workspaces: MyWorkspace[];
}

export default function WorkspaceList({ workspaces }: WorkspaceListProps) {
  return (
    <div className="flex flex-col gap-3">
      {workspaces.map((workspace) => {
        return (
          <WorkspaceItem
            key={workspace.id}
            workspace={workspace}
            showSettingsButton={
              workspace.role === WorkspaceMemberRole.Owner ||
              workspace.role === WorkspaceMemberRole.Moderator
            }
          />
        );
      })}
    </div>
  );
}
