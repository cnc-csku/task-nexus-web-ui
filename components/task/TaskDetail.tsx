"use client";

import useUpdateTaskTitle from "@/hooks/api/task/useUpdateTaskTitle";
import { Project, ProjectMember } from "@/interfaces/Project";
import { Task, UpdateTaskAssigneesType, UpdateTaskTitleFormType } from "@/interfaces/Task";
import { useState } from "react";
import UpdateTaskTitleInlineForm from "./UpdateTaskTitleInlineForm";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/errutils";
import TaskBadge from "./TaskBadge";
import { Tooltip } from "@heroui/tooltip";
import ChangeTaskStatusSelect from "./ChangeTaskStatusSelect";
import TaskAssigneesForm from "./TaskAssigneesForm";
import { getTaskLevel } from "@/utils/task";
import { Sprint } from "@/interfaces/Sprint";
import { TaskLevel } from "@/enums/Task";
import ChangeTaskEpicSelect from "./ChangeTaskEpicSelect";
import EditableDescription from "./EditableDescription";
import TaskComments from "./TaskComments";

export interface TaskDetailProps {
  project: Project;
  task: Task;
  members: ProjectMember[];
  sprints: Sprint[];
  allEpics: Task[];
}

export default function TaskDetail({ project, task, members, sprints, allEpics }: TaskDetailProps) {
  const [isTitleEditing, setIsTitleEditing] = useState<boolean>(false);

  const { mutateAsync: mutateTaskTitleAsync, isPending: isUpdateTitlePending } = useUpdateTaskTitle(
    project.id,
    task.taskRef
  );

  const taskLevel = getTaskLevel(task.type);

  const handleEditTask = () => {
    setIsTitleEditing(true);
  };

  const handleCancelEditTaskTitle = () => {
    setIsTitleEditing(false);
  };

  const handleSubmitEditTaskTitle = async (data: UpdateTaskTitleFormType) => {
    try {
      await mutateTaskTitleAsync({
        title: data.title,
      });

      toast.success("Task title updated successfully");

      setIsTitleEditing(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleCopyTaskRef = () => {
    navigator.clipboard.writeText(task.taskRef).catch((err) => {
      console.error("Failed to copy task Ref:", err);
    });
  };

  const handleSubmitUpdateAssignees = (data: UpdateTaskAssigneesType) => {
    console.log(JSON.stringify(data));
  };

  return (
    <div className="space-y-3 mx-auto lg:w-[900px] h-full block">
      <div className="flex items-center gap-1">
        <TaskBadge
          taskType={task.type}
          size="md"
        />
        <Tooltip
          content="Click to copy task ID"
          placement="top"
        >
          <div
            className="text-sm font-semibold ml-2 hover:bg-gray-200 p-1 rounded-lg cursor-pointer"
            onClick={(e) => handleCopyTaskRef()}
          >
            {task.taskRef}
          </div>
        </Tooltip>
        {isTitleEditing ? (
          <UpdateTaskTitleInlineForm
            title={task.title}
            onSubmit={handleSubmitEditTaskTitle}
            onCancel={handleCancelEditTaskTitle}
            isLoading={isUpdateTitlePending}
          />
        ) : (
          <div
            className="hover:bg-gray-200 cursor-pointer px-2 py-1 rounded-lg text-lg font-medium"
            onClick={handleEditTask}
          >
            {task.title}
          </div>
        )}
      </div>
      <div className="border border-gray-200 rounded-lg px-4 py-4 grid grid-cols-2 gap-6">
        <div className="grid gap-2 items-center grid-cols-5">
          <div className="col-span-2">Status</div>
          <div className="col-span-3">
            <ChangeTaskStatusSelect
              workflows={project.workflows}
              currentStatus={task.status}
              projectId={project.id}
              taskRef={task.taskRef}
            />
          </div>
        </div>
        <div className="grid gap-2 items-center grid-cols-5">
          <div className="col-span-2">Parent</div>
          <div className="col-span-3">
            {taskLevel === TaskLevel.Level1 ? (
              <ChangeTaskEpicSelect
                currentEpic={task.parentId}
                allEpics={allEpics}
                taskRef={task.taskRef}
                projectId={project.id}
              />
            ) : taskLevel === TaskLevel.Level2 ? (
              <div></div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="border border-gray-200 rounded-lg px-4 py-4 space-y-4">
        <TaskAssigneesForm
          positions={project.positions}
          members={members}
          submitFn={handleSubmitUpdateAssignees}
        />
      </div>
      <div className="border border-gray-200 rounded-lg px-4 py-4 grid gap-6">
        <div className="font-medium">Description</div>
        <EditableDescription
          task={task}
          projectId={project.id}
        />
      </div>

      <div className="border border-gray-200 rounded-lg px-4 py-2 space-y-3">
        <div className="font-medium">Comments</div>
        <div>
          <TaskComments
            projectId={project.id}
            task={task}
          />
        </div>
      </div>
    </div>
  );
}
