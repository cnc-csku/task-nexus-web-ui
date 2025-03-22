"use client";

import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import CreateTaskForm from "./CreateTaskForm";
import { CreateTaskRequestType, Task } from "@/interfaces/Task";
import { TaskLevel, TaskType } from "@/enums/Task";
import useCreateTask from "@/hooks/api/task/useCreateTask";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/errutils";
import useAllProjectMembers from "@/hooks/api/project/useAllProjectMembers";
import useFindProjectById from "@/hooks/api/project/useFindProjectById";
import useSprintsByProjectId from "@/hooks/api/sprint/useSprintsByProjectId";
import LoadingScreen from "../ui/LoadingScreen";
import { SprintStatus } from "@/enums/Sprint";

interface CreateTaskModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  parents: Task[];
  taskLevel: TaskLevel;
  defaultParentId: string | null;
  defaultSprintId: string | null;
}

export default function CreateTaskModal({
  isOpen,
  onOpenChange,
  projectId,
  parents,
  taskLevel,
  defaultParentId,
  defaultSprintId,
}: CreateTaskModalProps) {
  const { mutateAsync, isPending } = useCreateTask(projectId);

  const {
    data: members,
    isPending: isMemberPeding,
    error: memberError,
  } = useAllProjectMembers(projectId, 20);

  const {
    data: project,
    isPending: isProjectPending,
    error: projectError,
  } = useFindProjectById(projectId);

  const {
    data: sprints,
    isPending: isPendingSprints,
    error: errorSprints,
  } = useSprintsByProjectId(projectId, {
    statuses: [SprintStatus.Created, SprintStatus.InProgress],
  });

  if (isProjectPending || isMemberPeding || isPendingSprints) {
    return <LoadingScreen />;
  }

  if (projectError) {
    return <div>Error: {projectError.message}</div>;
  }

  if (memberError) {
    return <div>Error: {memberError.message}</div>;
  }

  if (errorSprints) {
    return <div>Error: {errorSprints.message}</div>;
  }

  const onCreateTask = async (data: CreateTaskRequestType) => {
    try {
      if (data.parentId === "") {
        data.parentId = null;
      }

      if (data.approvalUserIds) {
        data.approvalUserIds = data.approvalUserIds.filter((id) => id !== "");
      }

      await mutateAsync(data);

      onOpenChange(false);
      console.log(data);

      toast.success("Task created successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <Modal
      className="w-full max-w-3xl mx-auto"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="top"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Create Task</ModalHeader>
            <ModalBody>
              <CreateTaskForm
                parents={parents}
                sprints={sprints}
                submitFn={onCreateTask}
                isLoading={isPending}
                taskLevel={taskLevel}
                members={members}
                positions={project.positions}
                defaultParentId={defaultParentId}
                defaultSprintId={defaultSprintId}
                attributesTemplate={project.attributesTemplates}
                cancelFn={() => onClose()}
              />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
