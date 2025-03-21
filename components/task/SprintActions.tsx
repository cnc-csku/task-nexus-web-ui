"use client";

import { Sprint } from "@/interfaces/Sprint";
import { Button } from "@heroui/button";
import React from "react";
import { IoMdCheckmark, IoMdFlag } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import ConfirmationModal from "../ui/ConfirmationModal";
import { useDisclosure } from "@heroui/modal";
import SprintGoalModal from "./SprintGoalModal";

export interface SprintActionsProps {
  sprint: Sprint;
}

export default function SprintActions({ sprint }: SprintActionsProps) {
  const {
    isOpen: isUpdateSprintStatusOpen,
    onOpenChange: onOpenChangeUpdateSprintStatus,
    onOpen: onOpenUpdateSprintStatus,
  } = useDisclosure();

  const {
    isOpen: isSprintGoalModalOpen,
    onOpenChange: onOpenChangeSprintGoalModal,
    onOpen: onOpenSprintGoalModal,
  } = useDisclosure();

  return (
    <>
      <ConfirmationModal
        confirmationMessage="Are you sure you want to complete this sprint?"
        isOpen={isUpdateSprintStatusOpen}
        onOpenChange={onOpenChangeUpdateSprintStatus}
        onConfirm={() => {}}
      />
      <SprintGoalModal
        isOpen={isSprintGoalModalOpen}
        onOpenChange={onOpenChangeSprintGoalModal}
      />
      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          color="primary"
          startContent={<IoMdCheckmark />}
          onPress={() => onOpenUpdateSprintStatus()}
        >
          Complete Sprint
        </Button>
        <Button
          size="sm"
          color="primary"
          startContent={<IoMdFlag />}
          onPress={() => onOpenSprintGoalModal()}
        >
          Sprint Goal
        </Button>
        <Button
          size="sm"
          color="primary"
          startContent={<MdEdit />}
        >
          Edit Sprint
        </Button>
      </div>
    </>
  );
}
