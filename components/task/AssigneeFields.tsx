"use client";

import { ProjectMember } from "@/interfaces/Project";
import { CreateTaskRequestType } from "@/interfaces/Task";
import { Input } from "@heroui/input";
import {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  useWatch,
} from "react-hook-form";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import AssigneeItem from "../ui/AssigneeItem";

export interface AssigneeFieldsProps {
  register: UseFormRegister<CreateTaskRequestType>;
  watch: UseFormWatch<CreateTaskRequestType>;
  setValue: UseFormSetValue<CreateTaskRequestType>;
  errors: FieldErrors<CreateTaskRequestType>;
  positions: string[];
  members: ProjectMember[];
}

export default function AssigneeFields({
  register,
  watch,
  setValue,
  errors,
  positions,
  members,
}: AssigneeFieldsProps) {
  const filterMembersInPosition = (position: string) => {
    return members.filter((member) => member.position === position);
  };

  return (
    <div className="space-y-4">
      {positions.map((position, index) => (
        <div
          key={index}
          className="grid grid-cols-5 gap-4"
        >
          <Input
            label="Role"
            type="text"
            className="col-span-2"
            size="sm"
            defaultValue={position}
            isRequired
            readOnly
            isInvalid={!!errors.assignees?.[index]?.position}
            errorMessage={errors.assignees?.[index]?.position?.message}
            {...register(`assignees.${index}.position`)}
          />
          <Autocomplete
            className="col-span-2"
            label="User"
            size="sm"
            placeholder="Select assignee"
            selectedKey={watch(`assignees.${index}.userId`)}
            onSelectionChange={(key) =>
              setValue(`assignees.${index}.userId`, key?.toString() || "")
            }
            isInvalid={!!errors.assignees?.[index]?.userId}
            errorMessage={errors.assignees?.[index]?.userId?.message}
          >
            {filterMembersInPosition(position).map((member) => (
              <AutocompleteItem
                key={member.userId}
                textValue={member.displayName}
              >
                <AssigneeItem
                  name={member.displayName}
                  profileUrl={member.profileUrl}
                  key={member.userId}
                />
              </AutocompleteItem>
            ))}
          </Autocomplete>
          <Input
            label="Point"
            type="number"
            size="sm"
            min={0}
            max={100}
            isInvalid={!!errors.assignees?.[index]?.point}
            errorMessage={errors.assignees?.[index]?.point?.message}
            endContent={<span className="text-sm">pts</span>}
            {...register(`assignees.${index}.point`, {
              valueAsNumber: true,
            })}
          />
        </div>
      ))}
    </div>
  );
}
