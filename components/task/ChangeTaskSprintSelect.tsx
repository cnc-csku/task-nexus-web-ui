"use client";

import { getApiErrorMessage } from "@/utils/errutils";
import { Select, SelectItem } from "@heroui/select";
import { SharedSelection } from "@heroui/system";
import { toast } from "sonner";
import { Sprint } from "@/interfaces/Sprint";
import useUpdateTaskSprint from "@/hooks/api/task/useUpdateTaskSprint";
import { Autocomplete } from "@heroui/autocomplete";
import { Key } from "react";

export interface ChageTaskSprintSelectProps {
  projectId: string;
  taskRef: string;
  currentSprint: string;
  allSprints: Sprint[];
}

export default function ChageTaskSprintSelect({
  projectId,
  taskRef,
  currentSprint,
  allSprints,
}: ChageTaskSprintSelectProps) {
  const { mutateAsync, isPending } = useUpdateTaskSprint(projectId);

  const handleOnChange = async (key: Key | null) => {
    try {
      if (!key) {
        return;
      }

      await mutateAsync({
        taskRef: taskRef,
        currentSprintId: key.toString() === "BACKLOG" ? null : key.toString(),
      });

      toast.success("Task sprint updated successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <Autocomplete
      aria-label="task-sprint"
      className="w-full"
      size="sm"
      isLoading={isPending}
      onSelectionChange={handleOnChange}
      defaultSelectedKey={currentSprint || "BACKLOG"}
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
        <SelectItem
          key="BACKLOG"
          textValue="Backlog"
        >
          Backlog
        </SelectItem>
        {allSprints.map((sprint) => (
          <SelectItem
            key={sprint.id}
            textValue={sprint.title}
          >
            {sprint.title}
          </SelectItem>
        ))}
      </>
    </Autocomplete>
  );
}
