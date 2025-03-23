"use client";

import { Button } from "@heroui/button";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";

export interface ApproveReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason: string;
}

export default function ApproveReasonModal({ isOpen, onClose, reason }: ApproveReasonModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-full py-3"
    >
      <ModalContent>
        <ModalHeader>Approval Reason</ModalHeader>
        <ModalBody>
          <p className="text-gray-700">{reason}</p>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onPress={onClose}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
