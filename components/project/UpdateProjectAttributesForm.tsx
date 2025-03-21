"use client";

import {
  AttributeTemplate,
  UpdateProjectAttributesTemplatesSchema,
  UpdateProjectAttributesTemplatesType,
} from "@/interfaces/Project";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { Select, SelectItem } from "@heroui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FaTimes } from "react-icons/fa";
import { IoMdArrowForward } from "react-icons/io";
import { AttributeType } from "@/enums/Project";

export interface UpdateProjectAttributesFormProps {
  projectId: string;
  projectAttributes: AttributeTemplate[];
  isLoading: boolean;
  submitFn: (data: UpdateProjectAttributesTemplatesType) => void;
}

export default function UpdateProjectAttributesForm({
  projectId,
  projectAttributes,
  isLoading,
  submitFn,
}: UpdateProjectAttributesFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UpdateProjectAttributesTemplatesType>({
    resolver: zodResolver(UpdateProjectAttributesTemplatesSchema),
    defaultValues: {
      projectId,
      attributesTemplates: projectAttributes,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attributesTemplates",
  });

  return (
    <>
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
              label="Attribute Name"
              defaultValue={field.name}
              isInvalid={!!errors.attributesTemplates?.[index]?.name}
              errorMessage={errors.attributesTemplates?.[index]?.name?.message}
              isRequired={true}
              {...register(`attributesTemplates.${index}.name`)}
            />
            <Select
              label="Attribute Type"
              isInvalid={!!errors.attributesTemplates?.[index]?.type}
              isRequired={true}
              {...register(`attributesTemplates.${index}.type`)}
            >
              {Object.values(AttributeType).map((type) => (
                <SelectItem key={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </Select>
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
          onPress={() => append({ name: "", type: "" })}
          color="primary"
          className="cursor-pointer"
        >
          + Add Attribute
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
