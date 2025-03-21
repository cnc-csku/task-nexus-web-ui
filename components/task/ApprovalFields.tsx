"use client";

import { ProjectMember } from "@/interfaces/Project";
import { CreateTaskRequestType } from "@/interfaces/Task";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import React from "react";
import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { FaTimes } from "react-icons/fa";
import AssigneeItem from "../ui/AssigneeItem";

export interface ApprovalFieldsProps {
  register: UseFormRegister<CreateTaskRequestType>;
  control: Control<CreateTaskRequestType>;
  watch: UseFormWatch<CreateTaskRequestType>;
  setValue: UseFormSetValue<CreateTaskRequestType>;
  errors: FieldErrors<CreateTaskRequestType>;
  members: ProjectMember[];
}

export default function ApprovalFields({
  register,
  control,
  watch,
  setValue,
  errors,
  members,
}: ApprovalFieldsProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    // @ts-ignore
    name: "approvalUserIds",
  });

  return (
    <div className="grid gap-3">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="flex gap-2 items-center"
        >
          <Autocomplete
            className="col-span-2"
            label="User"
            size="sm"
            placeholder="Select assignee"
            selectedKey={watch(`approvalUserIds.${index}`)}
            onSelectionChange={(key) => key && setValue(`approvalUserIds.${index}`, key.toString())}
            isInvalid={!!errors.approvalUserIds?.[index]}
            errorMessage={errors.approvalUserIds?.[index]?.message}
          >
            {members.map((member) => (
              <AutocompleteItem
                key={member.userId}
                textValue={member.displayName}
              >
                <AssigneeItem
                  name={member.displayName}
                  profileUrl={member.profileUrl}
                  position={member.position}
                  key={member.userId}
                />
              </AutocompleteItem>
            ))}
          </Autocomplete>
          <Button
            type="button"
            color="danger"
            className="h-12"
            isIconOnly
            onPress={() => remove(index)}
          >
            <FaTimes />
          </Button>
        </div>
      ))}
      <Link
        onPress={() => append("")}
        color="primary"
        className="cursor-pointer"
      >
        + Add Approver
      </Link>
    </div>
  );
}
