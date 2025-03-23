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
  defaultValue: UpdateTaskAssigneesType;
  isHidePoint: boolean;
  submitFn: (data: UpdateTaskAssigneesType) => void;
}

export default function TaskAssigneesForm({
  positions,
  members,
  defaultValue,
  isHidePoint,
  submitFn,
}: TaskAssigneesFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateTaskAssigneesType>({
    defaultValues: defaultValue,
  });

  const filterMembersInPosition = (position: string) => {
    return members.filter((member) => member.position === position);
  };

  return (
    <form onSubmit={handleSubmit(submitFn)}>
      <div className="space-y-4">
        {positions.map((position, index) => (
          <div
            key={index}
            className="grid gap-4"
          >
            <div>
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
              isInvalid={!!errors.assignees?.[index]?.position}
              errorMessage={errors.assignees?.[index]?.position?.message}
              {...register(`assignees.${index}.position`)}
            />
            <div className="grid grid-cols-12 gap-2">
              <Autocomplete
                aria-label="Assignee"
                className={`${isHidePoint ? "col-span-12" : "col-span-8"}`}
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
                aria-label="Points"
                className={`col-span-4 ${isHidePoint ? "hidden" : ""}`}
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
