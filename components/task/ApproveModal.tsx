"use client";

import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import ApproveTaskForm from "./ApproveTaskForm";
import { ApproveTaskType } from "@/interfaces/Task";
import { useApproveTask } from "@/hooks/api/task/useApproveTask";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/errutils";

export interface ApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskRef: string;
  projectId: string;
}

export default function ApproveModal({ isOpen, onClose, taskRef, projectId }: ApproveModalProps) {
  const { mutateAsync: mutateApproveTaskAsync, isPending: isApproveTaskPending } = useApproveTask(
    projectId,
    taskRef
  );

  const onSubmitApproveTask = async (data: ApproveTaskType) => {
    try {
      await mutateApproveTaskAsync(data);

      toast.success("Task approved successfully");
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-full py-3"
    >
      <ModalContent>
        <ModalHeader>Approve Task</ModalHeader>
        <ModalBody>
          <ApproveTaskForm submitFn={onSubmitApproveTask} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
