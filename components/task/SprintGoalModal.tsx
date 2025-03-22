"use client";

import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";

interface SprintGoalModalProps {
  sprintGoals: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SprintGoalModal({
  sprintGoals,
  isOpen,
  onOpenChange,
}: SprintGoalModalProps) {
  
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent className="py-3">
        {() => (
          <>
            <ModalHeader>Sprint Goals</ModalHeader>
            <ModalBody className="mx-3">
              <p>{sprintGoals}</p>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
