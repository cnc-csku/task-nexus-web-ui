"use client";

import { QuickCreateEpicSchema, QuickCreateEpicType } from "@/interfaces/Task";
import { Input } from "@heroui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { DatePicker } from "@heroui/date-picker";
import { fromDate, today } from "@internationalized/date"; // Import today() for minValue
import { Button } from "@heroui/button";
import { IoMdClose } from "react-icons/io";

interface CreateEpicFormProps {
  submitFn: (data: QuickCreateEpicType) => void;
  isLoading: boolean;
}

export default function QuickCreateEpicForm({ submitFn, isLoading }: CreateEpicFormProps) {
  const {
    control,
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<QuickCreateEpicType>({
    resolver: zodResolver(QuickCreateEpicSchema),
    defaultValues: {
      title: "",
      startDate: null,
      dueDate: null,
    },
  });

  return (
    <form
      onSubmit={handleSubmit(submitFn)}
      className="space-y-4"
    >
      <Input
        label="Title"
        errorMessage={errors.title?.message}
        isInvalid={!!errors.title}
        isRequired
        autoFocus
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
              minValue={today("UTC")} // Set min selectable date to today
              errorMessage={errors.startDate?.message}
              isInvalid={!!errors.startDate}
              value={field.value ? fromDate(field.value, "UTC") : null}
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
              minValue={today("GMT")} // Prevent past due dates
              errorMessage={errors.dueDate?.message}
              isInvalid={!!errors.dueDate}
              value={field.value ? fromDate(field.value, "GMT") : null}
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

      <Button
        type="submit"
        color="primary"
        fullWidth
        isLoading={isLoading}
      >
        Create
      </Button>
    </form>
  );
}
