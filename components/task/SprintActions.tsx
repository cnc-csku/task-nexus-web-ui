"use client";

import { Sprint } from "@/interfaces/Sprint";
import { Button } from "@heroui/button";
import React from "react";
import { IoMdCheckmark, IoMdFlag } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { SprintStatus } from "@/enums/Sprint";
import { IoMdPlay } from "react-icons/io";

export interface SprintActionsProps {
  sprint: Sprint;
  onOpenChangeUpdateSprintStatusModal: (sprint: Sprint, toStatus: SprintStatus) => void;
  onOpenSprintGoalModal: (sprint: Sprint) => void;
  onOpenChangeEditSprintModal: (sprint: Sprint) => void;
}

export default function SprintActions({
  sprint,
  onOpenChangeUpdateSprintStatusModal,
  onOpenSprintGoalModal,
  onOpenChangeEditSprintModal,
}: SprintActionsProps) {
  return (
    <>
      <div className="flex justify-end gap-2">
        {sprint.status === SprintStatus.Created && (
          <Button
            size="sm"
            color="primary"
            startContent={<IoMdPlay />}
            onPress={() => onOpenChangeUpdateSprintStatusModal(sprint, SprintStatus.InProgress)}
          >
            Start Sprint
          </Button>
        )}
        {sprint.status === SprintStatus.InProgress && (
          <Button
            size="sm"
            color="primary"
            startContent={<IoMdCheckmark />}
            onPress={() => onOpenChangeUpdateSprintStatusModal(sprint, SprintStatus.Completed)}
          >
            Complete Sprint
          </Button>
        )}
        <Button
          size="sm"
          color="primary"
          startContent={<IoMdFlag />}
          onPress={() => onOpenSprintGoalModal(sprint)}
        >
          Sprint Goal
        </Button>
        <Button
          size="sm"
          color="primary"
          startContent={<MdEdit />}
          onPress={() => onOpenChangeEditSprintModal(sprint)}
        >
          Edit Sprint
        </Button>
      </div>
    </>
  );
}
