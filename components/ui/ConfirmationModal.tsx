"use client";

import { Button } from "@heroui/button";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";

export interface ConfirmationModalProps {
  isOpen: boolean;
  confirmationMessage: string;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel?: () => void;
}

export default function ConfirmationModal({
  isOpen,
  confirmationMessage,
  isLoading,
  onOpenChange,
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
                isLoading={isLoading}
                color="primary"
                onPress={() => {
                  onConfirm();
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
