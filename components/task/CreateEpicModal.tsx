"use client";

import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import QuickCreateEpicForm from "./QuickCreateEpicForm";
import { QuickCreateEpicType } from "@/interfaces/Task";
import useCreateTask from "@/hooks/api/task/useCreateTask";
import { TaskType } from "@/enums/Task";

interface CreateEpicModallProps {
  projectId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateEpicModal({
  projectId,
  isOpen,
  onOpenChange,
}: CreateEpicModallProps) {
  const { mutateAsync, isPending } = useCreateTask(projectId);

  const onCreateEpic = async (data: QuickCreateEpicType) => {
    await mutateAsync({
      title: data.title,
      type: TaskType.Epic,
      description: null,
      parentId: null,
      projectId: projectId,
      sprintId: null,
    });
    onOpenChange(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent className="py-3">
        {() => (
          <>
            <ModalHeader>Create an Epic</ModalHeader>
            <ModalBody>
              <QuickCreateEpicForm submitFn={onCreateEpic} isLoading={isPending}/>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
