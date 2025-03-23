import { Task } from "@/interfaces/Task";
import TaskBadge from "./TaskBadge";
import { Tooltip } from "@heroui/tooltip";
import { useRouter } from "next/navigation";
import { Badge } from "@heroui/badge";
import { Avatar } from "@heroui/avatar";

export interface ChildrenListItemProps {
  projectId: string;
  task: Task;
  compact?: boolean;
}

export default function ChildrenListItem({ projectId, task, compact }: ChildrenListItemProps) {
  const router = useRouter();

  const handleCopyTaskRef = () => {
    navigator.clipboard.writeText(task.taskRef).catch((err) => {
      console.error("Failed to copy task Ref:", err);
    });
  };

  const handleOnClickTask = () => {
    router.push(`/projects/${projectId}/tasks/${task.taskRef}`);
  };

  return (
    <div
      className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-gray-100 cursor-pointer justify-between"
      onClick={handleOnClickTask}
    >
      <div className="flex items-center gap-1">
        <TaskBadge
          taskType={task.type}
          size="md"
        />
        <Tooltip
          content="Click to copy task ID"
          placement="top"
        >
          <div
            className="text-sm font-semibold  hover:bg-gray-200 p-1 rounded-lg cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleCopyTaskRef();
            }}
          >
            {task.taskRef}
          </div>
        </Tooltip>
        <div>{task.title}</div>
      </div>
      <div className="flex gap-2 mr-1">
        {!compact && task.assignees
          .filter(
            (assignee) =>
              assignee.point !== null && assignee.userId !== "" && assignee.userId !== undefined
          )
          .sort((a, b) => (a.userId == null ? -1 : b.userId == null ? 1 : 0))
          .map((assignee, index) => (
            <Badge
              key={index}
              color="primary"
              content={assignee.point}
              placement="bottom-right"
              size="sm"
            >
              <Tooltip
                key={assignee.userId}
                showArrow={true}
                closeDelay={0}
                content={
                  <div>
                    <div className="text-center font-semibold">{assignee.position}</div>
                    <div>{assignee.displayName || "Unassigned"}</div>
                  </div>
                }
              >
                <Avatar
                  src={assignee.profileUrl || ""}
                  size="sm"
                />
              </Tooltip>
            </Badge>
          ))}
      </div>
    </div>
  );
}
