"use client";

import { UpdateProjectPositionsSchema, UpdateProjectPositionsType } from "@/interfaces/Project";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import ProjectPositionsSuggestion from "./ProjectPositionsSuggestion";
import { Link } from "@heroui/link";
import { IoMdArrowForward } from "react-icons/io";
import { FaTimes } from "react-icons/fa";

export interface UpdateProjectPositionsFormProps {
  projectId: string;
  isLoading: boolean;
  currentPositions: string[];
  submitFn: (data: UpdateProjectPositionsType) => void;
}

export default function UpdateProjectPositionsForm({
  projectId,
  isLoading,
  currentPositions,
  submitFn,
}: UpdateProjectPositionsFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<UpdateProjectPositionsType>({
    resolver: zodResolver(UpdateProjectPositionsSchema),
    defaultValues: {
      projectId,
      titles: currentPositions,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    // @ts-ignore
    name: "titles",
  });

  return (
    <>
      <ProjectPositionsSuggestion
        positions={watch("titles")}
        appendFn={append}
      />
      <form
        onSubmit={handleSubmit(submitFn)}
        className="mt-4 grid gap-4"
      >
        <input
          type="hidden"
          {...register("projectId")}
          value={projectId}
        />
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex gap-2 items-center"
          >
            <Input
              label={`Position ${index + 1}`}
              isInvalid={!!errors.titles?.[index]}
              errorMessage={errors.titles?.[index]?.message}
              {...register(`titles.${index}`)}
            />
            <Button
              type="button"
              color="danger"
              className="h-full"
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
          + Add Position
        </Link>
        <Button
          type="submit"
          color="primary"
          size="lg"
          endContent={<IoMdArrowForward />}
          isLoading={isLoading}
        >
          {isLoading ? "Updating..." : "Next Step"}
        </Button>
      </form>
    </>
  );
}
