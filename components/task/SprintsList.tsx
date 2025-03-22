"use client";

import useSprintsByProjectId from "@/hooks/api/sprint/useSprintsByProjectId";
import LoadingScreen from "../ui/LoadingScreen";
import { Project } from "@/interfaces/Project";
import { Task } from "@/interfaces/Task";
import { Button } from "@heroui/button";
import { AiOutlinePlus } from "react-icons/ai";
import useCreateSprint from "@/hooks/api/sprint/useCreateSprint";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/errutils";
import SprintTaskList from "./SprintTaskList";
import ConfirmationModal from "../ui/ConfirmationModal";
import { useState } from "react";
import { useDisclosure } from "@heroui/modal";
import { SprintStatus } from "@/enums/Sprint";
import StartSprintModal from "../sprint/StartSprintModal";
import { CompleteSprintResponse, Sprint, StartSprintType } from "@/interfaces/Sprint";
import useUpdateSprint from "@/hooks/api/sprint/useUpdateSprint";
import useUpdateSprintStatus from "@/hooks/api/sprint/useUpdateSprintStatus";
import SprintGoalModal from "./SprintGoalModal";
import useCompleteSprint from "@/hooks/api/sprint/useCompleteSprint";
import axios, { AxiosError } from "axios";
import RemaingNotDoneTasksModal from "../sprint/RemaingNotDoneTasksModal";
import EditSprintModal from "../sprint/EditSprintModal";

export interface SprintsListProps {
  project: Project;
  selectedEpic: string | null;
  selectedAssignees: string[];
  selectedPositions: string[];
  selectedStatuses: string[];
  search: string;
  allEpics: Task[];
  isShowDropArea: boolean;
  hoverOverId: string;
  onOpenSideTaskDetail: (taskId: string) => void;
  onOpenCreateTaskModal: (defaultSprintId: string | null, defaultParentId: string | null) => void;
}

export default function SprintsList({
  project,
  selectedEpic,
  selectedAssignees,
  selectedPositions,
  selectedStatuses,
  search,
  allEpics,
  isShowDropArea,
  hoverOverId,
  onOpenSideTaskDetail,
  onOpenCreateTaskModal,
}: SprintsListProps) {
  const [sprint, setSprint] = useState<Sprint | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string>("");
  const [remainingTaskRefs, setRemainingTaskRefs] = useState<string[]>([]);

  const {
    isOpen: isCompleleteSprintOpen,
    onOpenChange: onOpenChangeCompleteSprint,
    onClose: onCloseCompleteSprint,
  } = useDisclosure();

  const { isOpen: isSprintGoalOpen, onOpenChange: onOpenChangeSprintGoal } = useDisclosure();

  const {
    isOpen: isStartSprintOpen,
    onOpenChange: onOpenChangeStartSprint,
    onClose: onCloseStartSprint,
  } = useDisclosure();

  const { isOpen: isRemaingNotDoneTasksOpen, onOpenChange: onOpenChangeRemaingNotDoneTasks } =
    useDisclosure();

  const { isOpen: isEditSprintOpen, onOpenChange: onOpenChangeEditSprint } = useDisclosure();

  const {
    data: sprints,
    isPending: isSprintPending,
    error: sprintError,
  } = useSprintsByProjectId(project.id, {
    statuses: [SprintStatus.Created, SprintStatus.InProgress],
  });

  const { mutateAsync: createSprintMutateAsync, isPending: isCreateSprintPending } =
    useCreateSprint(project.id);

  const { mutateAsync: updateSprintMutateAsync, isPending: isUpdateSprintPending } =
    useUpdateSprint(project.id, sprint ? sprint.id : "");

  const { mutateAsync: updateSprintStatusMutateAsync, isPending: isUpdateSprintStatusPending } =
    useUpdateSprintStatus(project.id, sprint ? sprint.id : "");

  const { mutateAsync: completeSprintMutateAsync, isPending: isCompleteSprintPending } =
    useCompleteSprint(project.id, sprint ? sprint.id : "");

  if (isSprintPending) {
    return <LoadingScreen />;
  }

  if (sprintError) {
    return <div>Error: {sprintError.message}</div>;
  }

  const handleCreateSprint = async () => {
    try {
      await createSprintMutateAsync();

      toast.success("Create new sprint successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const onOpenChangeUpdateSprintStatusModal = (sprint: Sprint, toStatus: SprintStatus) => {
    setSprint(sprint);

    if (toStatus === SprintStatus.Completed) {
      setConfirmationMessage("Are you sure you want to complete this sprint?");

      onOpenChangeCompleteSprint();
    } else if (toStatus === SprintStatus.InProgress) {
      onOpenChangeStartSprint();
    }
  };

  const onOpenSprintGoalModal = (sprint: Sprint) => {
    if (!sprint) {
      return;
    }

    setSprint(sprint);

    onOpenChangeSprintGoal();
  };

  const onStartSprint = async (data: StartSprintType) => {
    if (!sprint) {
      return;
    }

    try {
      await updateSprintMutateAsync({
        title: sprint.title,
        startDate: data.startDate,
        endDate: data.endDate,
        sprintGoal: data.sprintGoal,
      });

      await updateSprintStatusMutateAsync({ status: SprintStatus.InProgress });

      onCloseStartSprint();

      toast.success("Start sprint successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const onCompletedSprint = async () => {
    if (!sprint) {
      return;
    }

    try {
      await completeSprintMutateAsync();

      onCloseCompleteSprint();

      toast.success("Complete sprint successfully");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<CompleteSprintResponse>;

        if (axiosError.response?.data.message === "not all tasks is done") {
          onCloseCompleteSprint();

          setRemainingTaskRefs(axiosError.response.data.fields ?? []);

          onOpenChangeRemaingNotDoneTasks();

          return;
        }

        return;
      }

      toast.error(getApiErrorMessage(error));
    }
  };

  const onOpenChangeEditSprintModal = (sprint: Sprint) => {
    setSprint(sprint);

    onOpenChangeEditSprint();
  };

  return (
    <>
      {sprint && (
        <>
          <StartSprintModal
            isOpen={isStartSprintOpen}
            onOpenChange={onOpenChangeStartSprint}
            sprint={sprint}
            submitFn={onStartSprint}
          />
          <ConfirmationModal
            confirmationMessage={confirmationMessage}
            isOpen={isCompleleteSprintOpen}
            isLoading={isCompleteSprintPending}
            onOpenChange={onOpenChangeCompleteSprint}
            onConfirm={onCompletedSprint}
          />
          <SprintGoalModal
            isOpen={isSprintGoalOpen}
            onOpenChange={onOpenChangeSprintGoal}
            sprintGoals={sprint.sprintGoal ?? ""}
          />
          <RemaingNotDoneTasksModal
            projectId={project.id}
            isOpen={isRemaingNotDoneTasksOpen}
            onOpenChange={onOpenChangeRemaingNotDoneTasks}
            remainingTaskRefs={remainingTaskRefs}
          />
          <EditSprintModal
            isOpen={isEditSprintOpen}
            onOpenChange={onOpenChangeEditSprint}
            projectId={project.id}
            sprint={sprint}
          />
        </>
      )}

      <div className="space-y-3">
        {sprints.map((sprint) => (
          <SprintTaskList
            key={sprint.id}
            project={project}
            sprint={sprint}
            selectedEpic={selectedEpic}
            selectedAssignees={selectedAssignees}
            selectedPositions={selectedPositions}
            selectedStatuses={selectedStatuses}
            search={search}
            allEpics={allEpics}
            isShowDropArea={isShowDropArea}
            hoverOverId={hoverOverId}
            onOpenChangeUpdateSprintStatusModal={onOpenChangeUpdateSprintStatusModal}
            onOpenSideTaskDetail={onOpenSideTaskDetail}
            onOpenCreateTaskModal={onOpenCreateTaskModal}
            onOpenSprintGoalModal={onOpenSprintGoalModal}
            onOpenChangeEditSprintModal={onOpenChangeEditSprintModal}
          />
        ))}

        <div className="w-full px-2">
          <Button
            className="w-full justify-start"
            color="primary"
            variant="light"
            startContent={<AiOutlinePlus className="text-lg" />}
            onPress={handleCreateSprint}
          >
            Create Sprint
          </Button>
        </div>
      </div>
    </>
  );
}
