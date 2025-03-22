import { Button } from "@heroui/button";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
import { Link } from "@heroui/link";
import useFindManyTasks from "@/hooks/api/task/useFindManyTasks";
import LoadingScreen from "../ui/LoadingScreen";
import { taskIcons } from "../icons/task";
import { Chip } from "@heroui/chip";

export interface RemaingNotDoneTasksModalProps {
  projectId: string;
  remainingTaskRefs: string[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RemaingNotDoneTasksModal({
  projectId,
  remainingTaskRefs,
  isOpen,
  onOpenChange,
}: RemaingNotDoneTasksModalProps) {
  const {
    data: tasks,
    isPending,
    error,
  } = useFindManyTasks(projectId, {
    taskRefs: remainingTaskRefs,
  });

  if (isPending) {
    return <LoadingScreen />;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent className="py-3">
        {(onClose) => (
          <>
            <ModalHeader>Remaining Not Done Tasks</ModalHeader>
            <ModalBody className="mx-3">
              <p>
                These tasks are not done yet. Please complete them before completing the sprint.
              </p>
              <div className="grid gap-1 cursor-pointer">
                {tasks.map((task) => (
                  <div className="flex gap-1 items-center  hover:bg-gray-100 p-2 rounded-lg">
                    <Chip color="primary">
                      <div
                        className="flex items-center gap-1"
                      >
                        {taskIcons[task.type]} {task.type}
                      </div>
                    </Chip>
                    <div>[{task.taskRef}] {task.title}</div>
                  </div>
                ))}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onPress={onClose}>Close</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
