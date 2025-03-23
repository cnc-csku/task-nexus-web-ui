"use client";

import { UpdateTaskAssigneesType } from "@/interfaces/Task";
import { useForm } from "react-hook-form";
import AssigneeFields from "./AssigneeFields";
import { ProjectMember } from "@/interfaces/Project";
import { Input } from "@heroui/input";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import AssigneeItem from "../ui/AssigneeItem";
import { Button } from "@heroui/button";

export interface TaskAssigneesFormProps {
  positions: string[];
  members: ProjectMember[];
  submitFn: (data: UpdateTaskAssigneesType) => void;
}

export default function TaskAssigneesForm({
  positions,
  members,
  submitFn,
}: TaskAssigneesFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateTaskAssigneesType>();

  const filterMembersInPosition = (position: string) => {
    return members.filter((member) => member.position === position);
  };

  return (
    <form onSubmit={handleSubmit(submitFn)}>
      <div className="space-y-4">
        {positions.map((position, index) => (
          <div
            key={index}
            className="grid grid-cols-5 gap-4"
          >
            <div className="col-span-2">
              <h3>{position}</h3>
            </div>
            <Input
              label="Role"
              type="hidden"
              className="col-span-2"
              size="sm"
              defaultValue={position}
              isRequired
              readOnly
              isInvalid={!!errors?.[index]?.position}
              errorMessage={errors?.[index]?.position?.message}
              {...register(`${index}.position`)}
            />
            <Autocomplete
              className="col-span-2"
              size="sm"
              placeholder="Select assignee"
              selectedKey={watch(`${index}.userId`)}
              onSelectionChange={(key) => setValue(`${index}.userId`, key?.toString() || "")}
              isInvalid={!!errors?.[index]?.userId}
              errorMessage={errors?.[index]?.userId?.message}
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
              type="number"
              size="sm"
              min={0}
              max={100}
              isInvalid={!!errors?.[index]?.point}
              errorMessage={errors?.[index]?.point?.message}
              endContent={<span className="text-sm">pts</span>}
              {...register(`${index}.point`, {
                valueAsNumber: true,
              })}
            />
          </div>
        ))}
        <div className="flex justify-end">
          <Button
            type="submit"
            size="sm"
            color="primary"
          >
            Save
          </Button>
        </div>
      </div>
    </form>
  );
}
