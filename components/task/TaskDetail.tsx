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
import ChageTaskSprintSelect from "./ChangeTaskSprintSelect";
import { DatePicker } from "@heroui/date-picker";
import { fromDate, today } from "@internationalized/date";
import { browserTimezone } from "@/utils/timeUtils";
import { IoMdCheckmark, IoMdClose } from "react-icons/io";
import CustomAttributeEditor from "./CustomAttributesEditor";
import ChildrenListDetail from "./ChildrenListDetail";
import useUpdateTaskAssignees from "@/hooks/api/task/useUpdateTaskAssignees";
import { Chip } from "@heroui/chip";
import ParentList from "./ParentList";
import { Avatar } from "@heroui/avatar";
import { FaCircle } from "react-icons/fa";
import { useSession } from "next-auth/react";
import LoadingScreen from "../ui/LoadingScreen";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import ApproveReasonModal from "./ApproveReasonModal";
import { MdChecklist } from "react-icons/md";
import ApproveModal from "./ApproveModal";

export interface TaskDetailProps {
  project: Project;
  task: Task;
  members: ProjectMember[];
  sprints: Sprint[];
  allEpics: Task[];
}

export default function TaskDetail({ project, task, members, sprints, allEpics }: TaskDetailProps) {
  const [isTitleEditing, setIsTitleEditing] = useState<boolean>(false);

  const {
    isOpen: isApproveOpen,
    onOpen: onApproveOpen,
    onOpenChange: onApproveOpenChange,
  } = useDisclosure();

  const {
    isOpen: isApproveReasonOpen,
    onOpen: onApproveReasonOpen,
    onOpenChange: onApproveReasonOpenChange,
  } = useDisclosure();

  const { mutateAsync: mutateTaskTitleAsync, isPending: isUpdateTitlePending } = useUpdateTaskTitle(
    project.id,
    task.taskRef
  );

  const { mutateAsync: mutateTaskAssigneesAsync, isPending: isUpdateAssigneesPending } =
    useUpdateTaskAssignees(project.id, task.taskRef);

  const { data: profile, status } = useSession();

  const taskLevel = getTaskLevel(task.type);

  const pendingApprovalList = task.approvals.filter((approval) => !approval.isApproved);

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

  const handleSubmitUpdateAssignees = async (data: UpdateTaskAssigneesType) => {
    try {
      await mutateTaskAssigneesAsync(data);

      toast.success("Task assignees updated successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const getDefaultAssignees = (): UpdateTaskAssigneesType => {
    const defaultAssignees: UpdateTaskAssigneesType = {
      assignees: [],
    };

    task.assignees.forEach((assignee) => {
      defaultAssignees.assignees.push({
        position: assignee.position,
        userId: assignee.userId,
        point: assignee.point ?? null,
      });
    });

    return defaultAssignees;
  };

  if (status === "loading") {
    return <LoadingScreen />;
  }

  const userId = profile?.user?.id as string;

  const needApprove = pendingApprovalList.some((approval) => approval.userId === userId);

  return (
    <>
      <div className="container mx-auto space-y-5">
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
        <div className="grid grid-cols-12 h-full gap-4">
          <div className="flex flex-col gap-3 col-span-8">
            <div className="border border-gray-200 rounded-lg px-4 py-4 grid gap-6">
              <div className="font-medium">Description</div>
              <EditableDescription
                task={task}
                projectId={project.id}
              />
            </div>
            {taskLevel !== TaskLevel.Level2 ? (
              <div className="border border-gray-200 rounded-lg px-4 py-4 grid gap-6">
                <div className="font-medium">Children</div>
                <ChildrenListDetail
                  project={project}
                  taskRef={task.taskRef}
                />
              </div>
            ) : (
              // Parent task
              <div className="border border-gray-200 rounded-lg px-4 py-4 grid gap-6">
                <div className="font-medium">Parent</div>
                {/* <ParentList
                      taskId={task.parentId!}
                      projectId={project.id}
                    /> */}
              </div>
            )}
            <div className="border border-gray-200 rounded-lg px-4 py-2 space-y-5">
              <div className="font-medium">Comments</div>
              <div>
                <TaskComments
                  projectId={project.id}
                  task={task}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col col-span-4 space-y-3">
            <div className="border border-gray-200 rounded-lg px-4 py-4 grid gap-6">
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
            <div className="border border-gray-200 rounded-lg px-4 py-4 grid gap-6">
              <div className="space-y-2">
                <div>Approval</div>
                {task.approvals.map((approval) => (
                  <div
                    key={approval.userId}
                    className="grid gap-2 items-center w-full"
                  >
                    <div className="flex items-center w-full">
                      <div className="flex basis-4/5">
                        <div className="flex items-center gap-2">
                          <div>
                            <Avatar
                              src={approval.profileUrl}
                              alt={approval.displayName}
                              size="sm"
                            />
                          </div>
                          <div>{approval.displayName}</div>
                        </div>
                      </div>
                      <div className="flex basis-1/5 items-center justify-end">
                        <div>
                          {approval.isApproved ? (
                            <>
                              <ApproveReasonModal
                                isOpen={isApproveReasonOpen}
                                onClose={onApproveReasonOpenChange}
                                reason={approval.reason}
                              />
                              <div className="flex gap-2 items-center">
                                <Tooltip content="Reason">
                                  <Button
                                    type="button"
                                    size="sm"
                                    onPress={onApproveReasonOpen}
                                    isIconOnly
                                    variant="light"
                                  >
                                    <MdChecklist
                                      className="text-sm p-1"
                                      size={25}
                                    />
                                  </Button>
                                </Tooltip>
                                <Tooltip content="Approved">
                                  <IoMdCheckmark
                                    className="text-green-600 text-sm p-1"
                                    size={25}
                                  />
                                </Tooltip>
                              </div>
                            </>
                          ) : (
                            <>
                              <Tooltip content="Pending">
                                <FaCircle className="text-orange-300 text mr-[6px] p-1" />
                              </Tooltip>
                              <ApproveModal
                                isOpen={isApproveOpen}
                                onClose={onApproveOpenChange}
                                taskRef={task.taskRef}
                                projectId={project.id}
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end">
                  {needApprove && (
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        color="primary"
                        size="sm"
                        startContent={<IoMdCheckmark />}
                        onPress={onApproveOpen}
                      >
                        Approve
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg px-4 py-4 space-y-4">
              <TaskAssigneesForm
                positions={project.positions}
                members={members}
                defaultValue={getDefaultAssignees()}
                submitFn={handleSubmitUpdateAssignees}
                isHidePoint={task.hasChildren}
              />
              {task.hasChildren && (
                <div className="grid gap-2 items-center grid-cols-5">
                  <div className="col-span-2">Children Point </div>
                  <div className="col-span-3">
                    <Chip color="primary">{task.childrenPoint}</Chip> pts.
                  </div>
                </div>
              )}
            </div>
            <div className="border border-gray-200 rounded-lg px-4 py-4 grid gap-6">
              <div className="grid gap-2 items-center grid-cols-5">
                <div className="col-span-2">Sprint</div>
                <div className="col-span-3">
                  <ChageTaskSprintSelect
                    projectId={project.id}
                    taskRef={task.taskRef}
                    currentSprint={task.sprint?.currentSprintId!}
                    allSprints={sprints}
                  />
                </div>
              </div>
              <div className="grid gap-2 items-center grid-cols-5">
                <div className="col-span-2">Start Date</div>
                <div className="col-span-3">
                  <DatePicker
                    granularity="day"
                    minValue={today(browserTimezone())}
                    value={task.startDate ? fromDate(task.startDate, browserTimezone()) : null}
                    selectorButtonPlacement="start"
                    endContent={
                      <button
                        type="button"
                        color="danger"
                        className="hover:bg-red-300 rounded-xl p-2 hover:text-red-500"
                      >
                        <IoMdClose />
                      </button>
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2 items-center grid-cols-5">
                <div className="col-span-2">Due Date</div>
                <div className="col-span-3">
                  <DatePicker
                    granularity="day"
                    minValue={today(browserTimezone())}
                    value={task.dueDate ? fromDate(task.dueDate, browserTimezone()) : null}
                    selectorButtonPlacement="start"
                    endContent={
                      <button
                        type="button"
                        color="danger"
                        className="hover:bg-red-300 rounded-xl p-2 hover:text-red-500"
                      >
                        <IoMdClose />
                      </button>
                    }
                  />
                </div>
              </div>
              {project.attributesTemplates.map((attribute) => (
                <div
                  className="grid gap-2 items-center grid-cols-5"
                  key={attribute.name}
                >
                  <div className="col-span-2">{attribute.name}</div>
                  <div className="col-span-3">
                    <CustomAttributeEditor
                      key={attribute.name}
                      attribute={attribute}
                      data={task.attributes.find((attr) => attr.key === attribute.name)?.value}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
