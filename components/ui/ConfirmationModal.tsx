"use client";

import { Button } from "@heroui/button";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";

export interface ConfirmationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  confirmationMessage: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export default function ConfirmationModal({
  isOpen,
  onOpenChange,
  confirmationMessage,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent className="py-3">
        {(onClose) => (
          <>
            <ModalHeader>Confirmation</ModalHeader>
            <ModalBody className="mx-3">
              <p>{confirmationMessage}</p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onPress={() => {
                  onConfirm();
                  onClose();
                }}
              >
                Confirm
              </Button>
              <Button
                color="default"
                onPress={() => {
                  onCancel && onCancel();
                  onClose();
                }}
              >
                Cancel
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
