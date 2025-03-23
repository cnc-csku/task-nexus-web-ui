import useTaskByRef from "@/hooks/api/task/useTaskDetailByRef";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { useEffect } from "react";
import LoadingScreen from "../ui/LoadingScreen";
import { IoMdClose } from "react-icons/io";
import { Button } from "@heroui/button";
import { Task, UpdateTaskAssigneesType } from "@/interfaces/Task";
import { Chip } from "@heroui/chip";
import { MdOpenInNew } from "react-icons/md";
import Link from "next/link";
import BlockNoteContent from "../ui/BlockNoteContent";
import TaskAssigneesForm from "./TaskAssigneesForm";
import useFindProjectById from "@/hooks/api/project/useFindProjectById";
import useAllProjectMembers from "@/hooks/api/project/useAllProjectMembers";
import { getApiErrorMessage } from "@/utils/errutils";
import { toast } from "sonner";
import useUpdateTaskAssignees from "@/hooks/api/task/useUpdateTaskAssignees";
import ChildrenListDetail from "./ChildrenListDetail";

export interface SideTaskDetailProps {
  projectId: string;
  taskRef: string;
  isOpen: boolean;
  allEpics: Task[];
  onClose: () => void;
}

export default function SideTaskDetail({
  projectId,
  taskRef,
  isOpen,
  allEpics,
  onClose,
}: SideTaskDetailProps) {
  const { data: task, isPending, error } = useTaskByRef(projectId, taskRef);
  const {
    data: project,
    isPending: isProjectPending,
    error: projectError,
  } = useFindProjectById(projectId);

  const {
    data: members,
    isPending: isMembersPending,
    error: membersError,
  } = useAllProjectMembers(projectId, 20);

  const { mutateAsync: mutateTaskAssigneesAsync } = useUpdateTaskAssignees(projectId, taskRef);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (isPending || isProjectPending || isMembersPending) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (projectError) {
    return <div>Error: {projectError.message}</div>;
  }

  if (membersError) {
    return <div>Error: {membersError.message}</div>;
  }

  const getDefaultAssignees = (): UpdateTaskAssigneesType => {
    const defaultAssignees: UpdateTaskAssigneesType = {
      assignees: [],
    };

    task.assignees.forEach((assignee) => {
      defaultAssignees.assignees.push({
        position: assignee.position,
        userId: assignee.userId,
        point: assignee.point ?? null,
      });
    });

    return defaultAssignees;
  };

  const handleSubmitUpdateAssignees = async (data: UpdateTaskAssigneesType) => {
    try {
      await mutateTaskAssigneesAsync(data);

      toast.success("Task assignees updated successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <Card className={`w-full ${!isOpen && "hidden"} shadow-none border h-[calc(100vh-10rem)]`}>
      <CardBody>
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <Chip color="primary">{task.type}</Chip>
            <div className="font-bold mr-2">{taskRef}</div>
          </div>
          <div className="space-x-2">
            <Button
              isIconOnly
              size="sm"
              className="font-bold"
              variant="light"
              as={Link}
              href={`/projects/${projectId}/tasks/${taskRef}`}
            >
              <MdOpenInNew size="15" />
            </Button>
            <Button
              onPress={onClose}
              isIconOnly
              size="sm"
              className="font-bold"
              variant="light"
            >
              <IoMdClose size="15" />
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-1">
          <div className="w-full font-semibold">{task.title}</div>
          <div className="text-gray-500">Description</div>
          <div className="w-full border rounded-md p-2">
            <BlockNoteContent content={task.description} />
          </div>

          <div className="mt-2 border rounded-md p-2 ">
            <TaskAssigneesForm
              positions={project.positions}
              members={members}
              defaultValue={getDefaultAssignees()}
              submitFn={handleSubmitUpdateAssignees}
              isHidePoint={task.hasChildren}
            />
          </div>
          {task.hasChildren && (
            <div className="mt-2 border rounded-md p-2">
              <div className="font-semibold">Children</div>
              <ChildrenListDetail
                project={project}
                taskRef={task.taskRef}
                compact={true}
              />
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
