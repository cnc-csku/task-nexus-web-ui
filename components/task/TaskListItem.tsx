"use client";

import { TaskApprovalSummary, Task, UpdateTaskTitleFormType } from "@/interfaces/Task";
import { Avatar } from "@heroui/avatar";
import { Badge } from "@heroui/badge";
import { Button } from "@heroui/button";
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
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import TaskBadge from "./TaskBadge";

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

    const approvedCount = task.approvals.filter((approval) => approval.isApproved).length;
    const allAprovalRequired = task.approvals.length;

    setApprovalSummary({
      pending: approvedCount,
      allApproved: allAprovalRequired,
      status: approvedCount === allAprovalRequired ? "SUCCESS" : "PENDING",
    });
  }, [task.approvals]);

  const { mutateAsync: mutateTaskTitleAsync, isPending: isUpdateTitlePending } = useUpdateTaskTitle(
    projectId,
    task.taskRef
  );

  const { attributes, listeners, setNodeRef, transform, setActivatorNodeRef } = useDraggable({
    id: task.taskRef,
    data: {
      currentSprint: task.sprint ? task.sprint.currentSprintId : "BACKLOG",
    },
  });

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

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      className="hover:bg-gray-100 px-2 py-1 rounded-lg over hover:cursor-pointer items-center"
      onClick={handleOnClickTask}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
    >
      <div
        className="col-span-3 flex items-center justify-between w-full"
        onMouseOver={handleHoverTask}
        onMouseLeave={handleLeaveTask}
      >
        <div className="flex items-center">
          <TaskBadge taskType={task.type} size="md"/>
          <Tooltip
            content="Click to copy task ID"
            placement="top"
          >
            <div
              className="text-sm font-semibold ml-2 hover:bg-gray-200 p-1 rounded-lg cursor-pointer"
              ref={setActivatorNodeRef}
              onClick={(e) => {
                e.stopPropagation();
                handleCopyTaskRef();
              }}
            >
              {task.taskRef}
            </div>
          </Tooltip>
          <div className="flex items-center">
            {isEditing ? (
              <UpdateTaskTitleInlineForm
                title={task.title}
                onSubmit={handleSubmitEditTaskTitle}
                onCancel={handleCancelEditTaskTitle}
                isLoading={isUpdateTitlePending}
              />
            ) : (
              <>
                <>{task.title}</>
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
        <div className="flex items-center gap-1">
          <div className="flex gap-2 mr-1">
            {task.assignees
              .filter(
                (assignee) =>
                  assignee.point !== null && assignee.userId !== "" && assignee.userId !== undefined
              )
              .sort((a, b) => (a.userId == null ? -1 : b.userId == null ? 1 : 0))
              .map((assignee, index) => (
                <Badge
                  key={index}
                  color="primary"
                  content={assignee.point}
                  placement="bottom-right"
                  size="sm"
                >
                  <Tooltip
                    key={assignee.userId}
                    showArrow={true}
                    content={
                      <div>
                        <div className="text-center font-semibold">{assignee.position}</div>
                        <div>{assignee.displayName || "Unassigned"}</div>
                      </div>
                    }
                  >
                    <Avatar
                      src={assignee.profileUrl || ""}
                      size="sm"
                    />
                  </Tooltip>
                </Badge>
              ))}
          </div>
          <div className="w-36">
            <ChangeTaskEpicSelect
              currentEpic={task.parentId}
              projectId={projectId}
              taskRef={task.taskRef}
              allEpics={allEpics}
            />
          </div>

          <div className="w-36">
            <ChangeTaskStatusSelect
              workflows={workflows}
              currentStatus={task.status}
              projectId={projectId}
              taskRef={task.taskRef}
              epics={allEpics}
            />
          </div>
          <div className="flex w-16 justify-end">
            <div className="flex gap-1 items-center justify-end">
              {approvalSummary.status === "SUCCESS" ? (
                <IoMdCheckmark className="text-green-600 text-sm" />
              ) : (
                <FaCircle className="text-orange-300 text-[9px] mr-[6px]" />
              )}
              <div className="text-gray-500 text-sm">
                ({approvalSummary.pending}/{approvalSummary.allApproved})
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
