import { IoMdArrowDropdown } from "react-icons/io";
import { SelectItem } from "@heroui/select";
import { Select } from "@heroui/select";
import { Task } from "@/interfaces/Task";
import { TaskPriority } from "@/enums/Task";
import { priorityIcons } from "../icons/task";
import useUpdateTaskDetail from "@/hooks/api/task/useUpdateTaskDetail";
import { Key } from "react";
import { SharedSelection } from "@heroui/system";
import { getApiErrorMessage } from "@/utils/errutils";
import { toast } from "sonner";

interface ChangeTaskPrioritySelectProps {
  projectId: string;
  task: Task;
}

export default function ChangeTaskPrioritySelect({
  projectId,
  task,
}: ChangeTaskPrioritySelectProps) {
  const { mutateAsync, isPending } = useUpdateTaskDetail(projectId, task.taskRef);

  const handleOnChange = async (keys: SharedSelection) => {
    if (!keys.currentKey) {
      return;
    }

    try {
      await mutateAsync({ ...task, priority: keys.currentKey.toString() });
      toast.success("Task priority updated successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <Select
      aria-label="task-priority"
      className="w-full"
      size="sm"
      onSelectionChange={handleOnChange}
      disallowEmptySelection
      defaultSelectedKeys={[task.priority]}
      isLoading={isPending}
    >
      {Object.values(TaskPriority).map((priority) => (
        <SelectItem
          key={priority}
          textValue={priority}
          startContent={priorityIcons[priority]}
        >
          {priority}
        </SelectItem>
      ))}
    </Select>
  );
}
