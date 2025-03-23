import useTaskByRef from "@/hooks/api/task/useTaskDetailById";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { useEffect } from "react";
import LoadingScreen from "../ui/LoadingScreen";
import { IoMdClose } from "react-icons/io";
import { Button } from "@heroui/button";
import { Task } from "@/interfaces/Task";
import { Chip } from "@heroui/chip";
import { MdOpenInNew } from "react-icons/md";
import Link from "next/link";

export interface SideTaskDetailProps {
  projectId: string;
  taskRef: string;
  isOpen: boolean;
  allEpics: Task[];
  onClose: () => void;
}

export default function SideTaskDetail({
  projectId,
  taskRef,
  isOpen,
  allEpics,
  onClose,
}: SideTaskDetailProps) {
  const { data: task, isPending, error } = useTaskByRef(projectId, taskRef);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (isPending) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Card className={`w-full ${!isOpen && "hidden"} shadow-none border h-[calc(100vh-10rem)]`}>
      <CardBody>
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <Chip color="primary">{task.type}</Chip>
            <div className="font-bold mr-2">{taskRef}</div>
          </div>
          <div className="space-x-2">
            <Button
              isIconOnly
              size="sm"
              className="font-bold"
              variant="light"
              as={Link}
              href={`/projects/${projectId}/tasks/${taskRef}`}
            >
              <MdOpenInNew size="15" />
            </Button>
            <Button
              onPress={onClose}
              isIconOnly
              size="sm"
              className="font-bold"
              variant="light"
            >
              <IoMdClose size="15" />
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-1">
          <div className="w-full font-semibold">{task.title}</div>
          <div className="text-gray-500">Description</div>
        </div>
      </CardBody>
    </Card>
  );
}
