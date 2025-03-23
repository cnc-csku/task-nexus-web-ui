"use client";

import { UpdateTaskTitleFormSchema, UpdateTaskTitleFormType } from "@/interfaces/Task";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { IoMdCheckmark, IoMdClose } from "react-icons/io";
import { toast } from "sonner";

export interface UpdateTaskTitleInlineFormProps {
  title: string;
  isLoading: boolean;
  onSubmit: (data: UpdateTaskTitleFormType) => void;
  onCancel: () => void;
}

export default function UpdateTaskTitleInlineForm({
  title,
  isLoading,
  onSubmit,
  onCancel,
}: UpdateTaskTitleInlineFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateTaskTitleFormType>({ resolver: zodResolver(UpdateTaskTitleFormSchema) });

  if (errors.title) {
    toast.error("Error: " + errors.title.message);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex gap-2 items-center w-[300px] sm:w-[400px] md:w-[500px]"
    >
      <Input
        size="sm"
        placeholder="Task Name"
        defaultValue={title}
        isReadOnly={isLoading}
        onClick={(e) => {
          e.stopPropagation();
        }}
        required
        autoFocus
        {...register("title")}
      />
      <Button
        size="sm"
        color="primary"
        isIconOnly
        variant="flat"
        type="submit"
        isLoading={isLoading}
      >
        <IoMdCheckmark />
      </Button>
      <Button
        size="sm"
        color="primary"
        isIconOnly
        variant="flat"
        type="button"
        onPress={onCancel}
      >
        <IoMdClose />
      </Button>
    </form>
  );
}
