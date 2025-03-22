"use client";

import { SprintStatus } from "@/enums/Sprint";
import {
  Sprint,
  UpdateSprintSchema,
  UpdateSprintType,
} from "@/interfaces/Sprint";
import { browserTimezone } from "@/utils/timeUtils";
import { Button } from "@heroui/button";
import { DatePicker } from "@heroui/date-picker";
import { Input, Textarea } from "@heroui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { fromDate, today } from "@internationalized/date";
import { Controller, useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";

export interface EditSprintFormProps {
  sprint: Sprint;
  isLoading: boolean;
  submitFn: (data: UpdateSprintType) => void;
}

export default function EditSprintForm({ sprint, isLoading, submitFn }: EditSprintFormProps) {
  const {
    control,
    register,
    resetField,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateSprintType>({
    resolver: zodResolver(UpdateSprintSchema),
    defaultValues: {
      title: sprint.title,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      sprintGoal: sprint.sprintGoal ?? "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(submitFn)}
      className="grid gap-4"
    >
      <Input
        label="Sprint Title"
        isInvalid={!!errors.title}
        errorMessage={errors.title?.message}
        {...register("title")}
      />

      <Controller
        name="startDate"
        control={control}
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <DatePicker
              label="Start Date"
              granularity="day"
              minValue={today(browserTimezone())} // Set min selectable date to today
              errorMessage={errors.startDate?.message}
              isInvalid={!!errors.startDate}
              value={field.value ? fromDate(field.value, browserTimezone()) : null}
              onChange={(dateValue) => {
                field.onChange(dateValue ? dateValue.toDate() : null);
              }}
              isRequired={sprint.status !== SprintStatus.Created}
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
        name="endDate"
        control={control}
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <DatePicker
              label="End Date"
              granularity="day"
              minValue={today(browserTimezone())}
              errorMessage={errors.endDate?.message}
              isInvalid={!!errors.endDate}
              value={field.value ? fromDate(field.value, browserTimezone()) : null}
              onChange={(dateValue) => {
                field.onChange(dateValue ? dateValue.toDate() : null);
              }}
              selectorButtonPlacement="start"
              isRequired={sprint.status !== SprintStatus.Created}
              endContent={
                <button
                  type="button"
                  color="danger"
                  className="hover:bg-red-300 rounded-xl p-2 hover:text-red-500"
                  onClick={() => resetField("endDate", { defaultValue: null })}
                >
                  <IoMdClose />
                </button>
              }
            />
          </div>
        )}
      />
      <Textarea
        label="Sprint Goals"
        isInvalid={!!errors.sprintGoal}
        errorMessage={errors.sprintGoal?.message}
        {...register("sprintGoal")}
      />
      <Button
        isLoading={isLoading}
        color="primary"
        type="submit"
      >
        Start Sprint
      </Button>
    </form>
  );
}
