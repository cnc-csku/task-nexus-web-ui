"use client";

import { TaskApprovalSummary, Task, UpdateTaskTitleFormType } from "@/interfaces/Task";
import { Avatar } from "@heroui/avatar";
import { Badge } from "@heroui/badge";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import { useEffect, useState } from "react";
import { FaCircle } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import UpdateTaskTitleInlineForm from "./UpdateTaskTitleInlineForm";
import useUpdateTaskTitle from "@/hooks/api/task/useUpdateTaskTitle";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/errutils";
import ChangeTaskStatusSelect from "./ChangeTaskStatusSelect";
import { Workflow } from "@/interfaces/Project";
import ChangeTaskEpicSelect from "./ChangeTaskEpicSelect";

export interface TaskListItemProps {
  projectId: string;
  workflows: Workflow[];
  allEpics: Task[];
  task: Task;
  onOpenSideTaskDetail: (taskId: string) => void;
}

export default function TaskListItem({
  projectId,
  task,
  allEpics,
  workflows,
  onOpenSideTaskDetail,
}: TaskListItemProps) {
  const [isShowEditButton, setIsShowEditButton] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [approvalSummary, setApprovalSummary] = useState<TaskApprovalSummary>({
    pending: 0,
    allApproved: 0,
    status: "SUCCESS",
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsEditing(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!task.approvals) {
      return;
    }

    const pending = task.approvals.filter((approval) => !approval.isApproved).length;
    const allApproved = task.approvals.filter((approval) => approval.isApproved).length;

    setApprovalSummary({
      pending,
      allApproved,
      status: pending === 0 ? "SUCCESS" : "PENDING",
    });
  }, [task.approvals]);

  const { mutateAsync: mutateTaskTitleAsync, isPending: isUpdateTitlePending } = useUpdateTaskTitle(
    projectId,
    task.taskRef
  );

  const handleOnClickTask = () => {
    onOpenSideTaskDetail(task.taskRef);
  };

  const handleHoverTask = () => {
    setIsShowEditButton(true);
  };

  const handleLeaveTask = () => {
    setIsShowEditButton(false);
  };

  const handleEditTask = () => {
    setIsEditing(true);
  };

  const handleCancelEditTaskTitle = () => {
    setIsEditing(false);
  };

  const handleCopyTaskRef = () => {
    navigator.clipboard.writeText(task.taskRef).catch((err) => {
      console.error("Failed to copy task Ref:", err);
    });
  };

  const handleSubmitEditTaskTitle = async (data: UpdateTaskTitleFormType) => {
    try {
      await mutateTaskTitleAsync({
        title: data.title,
      });

      toast.success("Task title updated successfully");

      setIsEditing(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div
      className="grid grid-cols-5 gap-1 hover:bg-gray-100 px-2 py-1 rounded-lg over"
      onClick={handleOnClickTask}
    >
      <div
        className="col-span-3 flex items-center"
        onMouseOver={handleHoverTask}
        onMouseLeave={handleLeaveTask}
      >
        <Chip color="primary">{task.type}</Chip>
        <Tooltip
          content="Click to copy task ID"
          placement="top"
        >
          <div
            className="text-sm font-semibold ml-2 hover:bg-gray-200 p-1 rounded-lg cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleCopyTaskRef();
            }}
          >
            {task.taskRef}
          </div>
        </Tooltip>
        <div className="flex items-center gap-1 ml-1">
          {isEditing ? (
            <UpdateTaskTitleInlineForm
              title={task.title}
              onSubmit={handleSubmitEditTaskTitle}
              onCancel={handleCancelEditTaskTitle}
              isLoading={isUpdateTitlePending}
            />
          ) : (
            <>
              <div>{task.title}</div>
              <Button
                color="primary"
                size="sm"
                className={`scale-90 ${!isShowEditButton && "hidden"}`}
                variant="light"
                isIconOnly
                onPress={handleEditTask}
              >
                <MdEdit className="text-sm" />
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 col-span-2 items-center">
        <ChangeTaskEpicSelect
          currentEpic={task.parentId}
          projectId={projectId}
          taskRef={task.taskRef}
          allEpics={allEpics}
        />
        <ChangeTaskStatusSelect
          workflows={workflows}
          currentStatus={task.status}
          projectId={projectId}
          taskRef={task.taskRef}
          epics={allEpics}
        />
        <div className="grid grid-cols-2 gap-2">
          <div className="flex gap-2">
            <Badge
              color="primary"
              content="2"
              placement="bottom-right"
              size="sm"
              className="w-1 h-1"
            >
              <Avatar
                src="https://i.pravatar.cc/150?img=1"
                size="sm"
              />
            </Badge>
            <Badge
              color="primary"
              content="3"
              placement="bottom-right"
              size="sm"
            >
              <Avatar
                src="https://i.pravatar.cc/150?img=1"
                size="sm"
              />
            </Badge>
          </div>
          <div className="flex gap-1 items-center justify-center">
            {approvalSummary.status === "SUCCESS" ? (
              <IoMdCheckmark className="text-green-600 text-sm" />
            ) : (
              <FaCircle className="text-orange-300 text-[9px]" />
            )}
            <div className="text-gray-500 text-sm">
              ({approvalSummary.pending}/{approvalSummary.allApproved})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
