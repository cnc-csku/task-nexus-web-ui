import useTaskById from "@/hooks/api/task/useTaskDetailById";
import { Card, CardHeader } from "@heroui/card";
import { useEffect } from "react";
import LoadingScreen from "../ui/LoadingScreen";
import { IoMdClose } from "react-icons/io";
import { Button } from "@heroui/button";
import { Task } from "@/interfaces/Task";

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
  const { data: task, isPending, error } = useTaskById(projectId, taskRef);

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
      <CardHeader>
        <div className="flex justify-between items-center w-full">
          <div className="font-bold">{task.title}</div>
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
      </CardHeader>
    </Card>
  );
}
