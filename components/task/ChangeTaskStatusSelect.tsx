"use client";

import useUpdateTaskStatus from "@/hooks/api/task/useUpdateTaskStatus";
import { Workflow } from "@/interfaces/Project";
import { Task } from "@/interfaces/Task";
import { getApiErrorMessage } from "@/utils/errutils";
import { Select, SelectItem } from "@heroui/select";
import { SharedSelection } from "@heroui/system";
import { useState } from "react";
import { toast } from "sonner";
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from "react-icons/md";

export interface ChageTaskStatusSelectProps {
  projectId: string;
  workflows: Workflow[];
  epics: Task[];
  taskRef: string;
  currentStatus: string;
}

export default function ChageTaskStatusSelect({
  projectId,
  taskRef,
  workflows,
  currentStatus,
}: ChageTaskStatusSelectProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { mutateAsync, isPending } = useUpdateTaskStatus(projectId, taskRef);

  const handleOnChange = async (key: SharedSelection) => {
    try {
      if (!key.anchorKey) {
        return;
      }
      await mutateAsync({ status: key.anchorKey });

      setIsOpen(false);

      toast.success("Task status updated successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const nextStatuses = workflows.filter((workflow) =>
    workflow.previousStatuses?.includes(currentStatus)
  );

  const previousStatuses =
    workflows.find((workflow) => workflow.status === currentStatus)?.previousStatuses ?? [];

  return (
    <Select
      aria-label="task-status"
      className="w-full"
      isOpen={isOpen}
      size="sm"
      onClick={() => setIsOpen(!isOpen)}
      defaultSelectedKeys={[currentStatus]}
      disallowEmptySelection
      isLoading={isPending}
      onSelectionChange={handleOnChange}
      disabledKeys={[currentStatus]}
      listboxProps={{
        itemClasses: {
          base: ["rounded-md", "min-w-[200px]"],
        },
      }}
      popoverProps={{
        classNames: {
          content: "p-1 min-w-[250px]",
        },
      }}
    >
      <>
        {previousStatuses.map((status) => (
          <SelectItem
            key={status}
            textValue={status}
            startContent={<MdOutlineArrowBackIos size={"10"} />}
          >
            {status}
          </SelectItem>
        ))}
        <SelectItem
          key={currentStatus}
          textValue={currentStatus}
        >
          {currentStatus}
        </SelectItem>
        {nextStatuses.map(({ status }) => (
          <SelectItem
            key={status}
            textValue={status}
            startContent={<MdOutlineArrowForwardIos size={"10"} />}
          >
            {status}
          </SelectItem>
        ))}
      </>
    </Select>
  );
}
