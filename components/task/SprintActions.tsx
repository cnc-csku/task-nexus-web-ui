import { Button } from "@heroui/button";
import React from "react";
import { IoMdCheckmark, IoMdFlag } from "react-icons/io";
import { MdEdit } from "react-icons/md";

export default function SprintActions() {
  return (
    <div className="flex justify-end gap-2">
      <Button
        size="sm"
        color="primary"
        startContent={<IoMdCheckmark />}
      >
        Complete Sprint
      </Button>
      <Button
        size="sm"
        color="primary"
        startContent={<IoMdFlag />}
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
  );
}
