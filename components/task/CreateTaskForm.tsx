"use client";

import { TaskLevel, TaskPriority, TaskType } from "@/enums/Task";
import { priorityIcons, taskIcons } from "@/components/icons/task";
import { CreateTaskRequestType, Task } from "@/interfaces/Task";
import { Button } from "@heroui/button";
import { DatePicker } from "@heroui/date-picker";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Controller, useForm } from "react-hook-form";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { fromDate, today } from "@internationalized/date";
import { IoMdClose } from "react-icons/io";
import AssigneeFields from "./AssigneeFields";
import { AttributeTemplate, ProjectMember } from "@/interfaces/Project";
import CustomAttributeFields from "./CustomAttributeFields";
import ApprovalFields from "./ApprovalFields";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Sprint } from "@/interfaces/Sprint";
import { browserTimezone } from "@/utils/timeUtils";

export interface CreateTaskFormProps {
  parents: Task[];
  sprints: Sprint[];
  taskLevel: TaskLevel;
  isLoading: boolean;
  positions: string[];
  attributesTemplate: AttributeTemplate[];
  members: ProjectMember[];
  defaultSprintId: string | null;
  defaultParentId: string | null;
  submitFn: (data: CreateTaskRequestType) => void;
  cancelFn: () => void;
}

export default function CreateTaskForm({
  parents,
  sprints,
  taskLevel,
  isLoading,
  members,
  positions,
  defaultSprintId,
  defaultParentId,
  attributesTemplate,
  submitFn,
  cancelFn,
}: CreateTaskFormProps) {
  const {
    control,
    register,
    handleSubmit,
    resetField,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateTaskRequestType>({
    defaultValues: {
      description: JSON.stringify([
        {
          id: "4bbfc57b-d00c-49f6-af09-caf198534f1f",
          type: "paragraph",
          props: { textColor: "default", backgroundColor: "default", textAlignment: "left" },
          content: [{ type: "text", text: " ", styles: {} }],
          children: [],
        },
      ]),
      sprintId: defaultSprintId ?? null,
      parentId: defaultParentId ?? null,
    },
  });

  const availableTaskTypes =
    taskLevel === TaskLevel.Level0
      ? [TaskType.Epic]
      : TaskLevel.Level1
      ? [TaskType.Story, TaskType.Task, TaskType.Bug]
      : [TaskType.SubTask];

  const editor = useCreateBlockNote();

  return (
    <form
      className="grid grid-cols-1 gap-4 py-2"
      onSubmit={handleSubmit(submitFn)}
    >
      <Input
        label="Title"
        size="sm"
        errorMessage={errors.title?.message}
        isInvalid={!!errors.title}
        isRequired
        {...register("title")}
      />
      <div className="border rounded-lg border-gray-200 min-h-36">
        <div className="p-3 text-sm text-gray-700">Description</div>
        <Controller
          name="description"
          control={control}
          render={() => {
            return (
              <BlockNoteView
                editor={editor}
                onChange={() => {
                  setValue("description", JSON.stringify(editor.document));
                }}
              />
            );
          }}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Task Type"
          size="sm"
          defaultSelectedKeys={[availableTaskTypes[0]]}
          isRequired
          disallowEmptySelection
          {...register("type")}
        >
          {Object.values(availableTaskTypes).map((type) => (
            <SelectItem
              key={type}
              startContent={taskIcons[type]}
            >
              {type.replaceAll("_", " ")}
            </SelectItem>
          ))}
        </Select>
        <Autocomplete
          label="Parent"
          size="sm"
          selectedKey={watch("parentId")}
          onSelectionChange={(key) => setValue("parentId", key?.toString() || "")}
          isInvalid={!!errors.parentId}
          errorMessage={errors.parentId?.message}
        >
          {parents.map((parent) => (
            <AutocompleteItem
              key={parent.id}
              textValue={parent.title}
              startContent={taskIcons[parent.type]}
            >
              {parent.title}
            </AutocompleteItem>
          ))}
        </Autocomplete>
        <Select
          label="Priority"
          size="sm"
          isRequired
          defaultSelectedKeys={[TaskPriority.Low]}
          disallowEmptySelection
          {...register("priority")}
        >
          {Object.values(TaskPriority).map((priority) => (
            <SelectItem
              startContent={priorityIcons[priority]}
              key={priority}
            >
              {priority}
            </SelectItem>
          ))}
        </Select>
        <Autocomplete
          label="Sprint"
          size="sm"
          selectedKey={watch("sprintId")}
          onSelectionChange={(key) => setValue("sprintId", key?.toString() || "")}
          isInvalid={!!errors.sprintId}
          errorMessage={errors.sprintId?.message}
        >
          {sprints.map((sprint) => (
            <AutocompleteItem
              key={sprint.id}
              textValue={sprint.title}
            >
              <div className="flex items-center gap-2">
                <span>{sprint.title}</span>
              </div>
            </AutocompleteItem>
          ))}
        </Autocomplete>
      </div>
      <hr />
      <h2>Assignees</h2>
      <AssigneeFields
        register={register}
        setValue={setValue}
        watch={watch}
        errors={errors}
        positions={positions}
        members={members}
      />
      <hr />
      <h2>Attributes</h2>
      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="startDate"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <DatePicker
                label="Start Date"
                granularity="day"
                minValue={today(browserTimezone())}
                errorMessage={errors.startDate?.message}
                isInvalid={!!errors.startDate}
                value={field.value ? fromDate(field.value, browserTimezone()) : null}
                onChange={(dateValue) => {
                  field.onChange(dateValue ? dateValue.toDate() : null);
                }}
                selectorButtonPlacement="start"
                endContent={
                  <button
                    type="button"
                    color="danger"
                    className="hover:bg-red-300 rounded-xl p-2 hover:text-red-500"
                    onClick={() => resetField("startDate", { defaultValue: null })}
                  >
                    <IoMdClose />
                  </button>
                }
              />
            </div>
          )}
        />
        <Controller
          name="dueDate"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <DatePicker
                label="Due Date"
                granularity="day"
                minValue={today(browserTimezone())}
                errorMessage={errors.dueDate?.message}
                isInvalid={!!errors.dueDate}
                value={field.value ? fromDate(field.value, browserTimezone()) : null}
                onChange={(dateValue) => {
                  field.onChange(dateValue ? dateValue.toDate() : null);
                }}
                selectorButtonPlacement="start"
                endContent={
                  <button
                    type="button"
                    color="danger"
                    className="hover:bg-red-300 rounded-xl p-2 hover:text-red-500"
                    onClick={() => resetField("dueDate", { defaultValue: null })}
                  >
                    <IoMdClose />
                  </button>
                }
              />
            </div>
          )}
        />
      </div>

      <CustomAttributeFields
        register={register}
        control={control}
        resetField={resetField}
        attributes={attributesTemplate}
      />
      <hr />
      <h2>Approval</h2>
      <ApprovalFields
        register={register}
        control={control}
        members={members}
        errors={errors}
        setValue={setValue}
        watch={watch}
      />
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          onPress={cancelFn}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          type="submit"
          isLoading={isLoading}
        >
          Create Task
        </Button>
      </div>
    </form>
  );
}
