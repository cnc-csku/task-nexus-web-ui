"use client";

import useUpdateTaskParent from "@/hooks/api/task/useUpdateTaskParent";
import { Task } from "@/interfaces/Task";
import { getApiErrorMessage } from "@/utils/errutils";
import { Select, SelectItem } from "@heroui/select";
import { SharedSelection } from "@heroui/system";
import { useState } from "react";
import { toast } from "sonner";
import { taskIcons } from "../icons/task";

export interface ChangeTaskEpicSelectProps {
  currentEpic: string | null;
  allEpics: Task[];
  taskRef: string;
  projectId: string;
}

export default function ChangeTaskEpicSelect({
  currentEpic,
  allEpics,
  taskRef,
  projectId,
}: ChangeTaskEpicSelectProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { mutateAsync, isPending } = useUpdateTaskParent(projectId, taskRef);

  const handleOnChange = async (key: SharedSelection) => {
    try {
      if (!key.anchorKey) {
        return;
      }
      await mutateAsync({ parentId: key.anchorKey === "NO_EPIC" ? null : key.anchorKey });

      setIsOpen(false);

      toast.success("Task epic updated successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <Select
      aria-label="epic-select"
      className="w-full"
      size="sm"
      color="secondary"
      placeholder="No Epic"
      isOpen={isOpen}
      onClick={() => setIsOpen(!isOpen)}
      defaultSelectedKeys={[currentEpic ?? "NO_EPIC"]}
      onSelectionChange={handleOnChange}
      isLoading={isPending}
      disallowEmptySelection
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
        <SelectItem key="NO_EPIC">No Epic</SelectItem>
        {allEpics.map((epic) => (
          <SelectItem
            startContent={taskIcons["EPIC"]}
            key={epic.id}
          >
            {epic.title}
          </SelectItem>
        ))}
      </>
    </Select>
  );
}
