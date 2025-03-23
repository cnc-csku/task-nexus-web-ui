import { Workspace } from "@/interfaces/Workspace";
import { Button } from "@heroui/button";
import Link from "next/link";
import { SlArrowRight, SlSettings } from "react-icons/sl";

export interface WorkspaceItemProps {
  workspace: Workspace;
  showSettingsButton: boolean;
}

export default function WorkspaceItem({ workspace, showSettingsButton }: WorkspaceItemProps) {
  return (
    <div className="flex items-center">
      <Link
        href={`/workspaces/${workspace.id}/projects`}
        className="flex flex-col border border-gray-200 rounded-2xl hover:bg-gray-200 transition-colors w-full"
      >
        <div className="px-5 py-4">
          <div className="flex items-center justify-between">
            <div>{workspace.name}</div>
            <div>
              <SlArrowRight className="text-md" />
            </div>
          </div>
        </div>
      </Link>
      {showSettingsButton && (
        <div className="px-5 py-4">
          <Button
            isIconOnly
            variant="flat"
            size="lg"
            as={Link}
            href={`/workspaces/${workspace.id}/settings`}
          >
            <SlSettings className="text-md" />
          </Button>
        </div>
      )}
    </div>
  );
}
