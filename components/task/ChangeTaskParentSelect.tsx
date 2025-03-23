import useUpdateTaskParent from "@/hooks/api/task/useUpdateTaskParent";
import { Task } from "@/interfaces/Task";
import { getApiErrorMessage } from "@/utils/errutils";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Key } from "react";
import { toast } from "sonner";

export interface ChangeTaskParentSelectProps {
  projectId: string;
  parents: Task[];
  task: Task;
}

export default function ChangeTaskParentSelect({
  projectId,
  parents,
  task,
}: ChangeTaskParentSelectProps) {
  const { mutateAsync, isPending } = useUpdateTaskParent(projectId, task.taskRef);

  const handleOnChange = async (key: Key | null) => {
    if (!key) {
      return;
    }

    try {
      await mutateAsync({ parentId: key.toString() });
      toast.success("Task parent updated successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <Autocomplete
      aria-label="task-parent"
      className="w-full"
      size="sm"
      isLoading={isPending}
      onSelectionChange={handleOnChange}
      defaultSelectedKey={task.parentId ?? undefined}
    >
      {parents.map((parent) => (
        <AutocompleteItem
          key={parent.id}
          textValue={parent.title}
        >
          {parent.title}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
}
