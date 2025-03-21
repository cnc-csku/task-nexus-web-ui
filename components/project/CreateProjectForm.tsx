"use client";

import { Input } from "@heroui/input";
import { useForm } from "react-hook-form";
import { CreateProjectSchema, CreateProjectType } from "@/interfaces/Project";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@heroui/button";

export interface CreateProjectFormProps {
  workspaceId: string;
  isLoading: boolean;
  submitFn: (data: CreateProjectType) => void;
}

export default function CreateProjectForm({
  workspaceId,
  isLoading,
  submitFn,
}: CreateProjectFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProjectType>({
    resolver: zodResolver(CreateProjectSchema),
  });

  return (
    <form
      onSubmit={handleSubmit(submitFn)}
      className="mt-4 grid gap-4"
    >
      <input
        type="hidden"
        {...register("workspaceId")}
        value={workspaceId}
      />
      <Input
        label="Name"
        isInvalid={!!errors.name}
        errorMessage={errors.name?.message}
        isRequired={true}
        {...register("name")}
      />
      <Input
        label="Project Prefix"
        isInvalid={!!errors.projectPrefix}
        errorMessage={errors.projectPrefix?.message}
        isRequired={true}
        {...register("projectPrefix")}
      />
      <Input
        label="Description"
        isInvalid={!!errors.description}
        errorMessage={errors.description?.message}
        {...register("description")}
      />
      <Button
        type="submit"
        color="primary"
        size="lg"
        isLoading={isLoading}
      >
        Create
      </Button>
    </form>
  );
}
