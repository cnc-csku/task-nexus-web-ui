import { Sprint, UpdateSprintType } from "@/interfaces/Sprint";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import EditSprintForm from "./EditSprintForm";
import useUpdateSprint from "@/hooks/api/sprint/useUpdateSprint";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/errutils";

export interface EditSprintModalProps {
  sprint: Sprint;
  projectId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditSprintModal({
  projectId,
  sprint,
  isOpen,
  onOpenChange,
}: EditSprintModalProps) {
  const { mutateAsync, isPending } = useUpdateSprint(projectId, sprint.id);

  const onUpdateSprint = async (data: UpdateSprintType) => {
    try {
      await mutateAsync(data);

      toast.success("Sprint updated successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }

    onOpenChange(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        <ModalHeader>Edit Sprint</ModalHeader>
        <ModalBody>
          <EditSprintForm
            sprint={sprint}
            isLoading={isPending}
            submitFn={onUpdateSprint}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
