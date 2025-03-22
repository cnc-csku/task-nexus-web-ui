import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
import StartSprintForm from "./StartSprintForm";
import { Sprint, StartSprintType } from "@/interfaces/Sprint";

export interface StartSprintModalProps {
  sprint: Sprint;
  isOpen: boolean;
  onOpenChange: () => void;
  submitFn: (data: StartSprintType) => void;
}

export default function StartSprintModal({
  sprint,
  isOpen,
  onOpenChange,
  submitFn,
}: StartSprintModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent className="py-3">
        <>
          <ModalHeader>Start Sprint</ModalHeader>
          <ModalBody>
            <StartSprintForm
              sprint={sprint}
              isLoading={false}
              submitFn={submitFn}
            />
          </ModalBody>
        </>
      </ModalContent>
    </Modal>
  );
}
