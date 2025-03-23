import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import TaskDetail from "./TaskDetail";
import { Project } from "@/interfaces/Project";
import { Task } from "@/interfaces/Task";
import { ProjectMember } from "@/interfaces/Project";
import { Sprint } from "@/interfaces/Sprint";
import useTaskByRef from "@/hooks/api/task/useTaskDetailByRef";
import LoadingScreen from "../ui/LoadingScreen";
import { Button } from "@heroui/button";
import Link from "next/link";
import { MdOpenInNew } from "react-icons/md";

export interface TaskDetailModalProps {
  project: Project;
  taskRef: string;
  members: ProjectMember[];
  sprints: Sprint[];
  allEpics: Task[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TaskDetailModal({
  project,
  taskRef,
  members,
  sprints,
  allEpics,
  isOpen,
  onOpenChange,
}: TaskDetailModalProps) {
  const {
    data: task,
    isPending: isTaskPending,
    error: taskError,
  } = useTaskByRef(project.id, taskRef);

  if (isTaskPending) {
    return <LoadingScreen />;
  }

  if (taskError) {
    return <div>Error: {taskError.message}</div>;
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{
        base: "w-full max-w-6xl",
      }}
      placement="top"
    >
      <ModalContent>
        <ModalHeader>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{task.title}</div>
            <div className="flex items-center gap-2">
              <Button
                isIconOnly
                className="font-bold"
                variant="light"
                as={Link}
                href={`/projects/${project.id}/tasks/${taskRef}`}
              >
                <MdOpenInNew size="15" />
              </Button>
            </div>
          </div>
        </ModalHeader>
        <ModalBody>
          <TaskDetail
            project={project}
            task={task}
            members={members}
            sprints={sprints}
            allEpics={allEpics}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
