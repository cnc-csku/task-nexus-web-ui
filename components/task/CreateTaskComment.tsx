"use client";

import { CreateTaskCommentType } from "@/interfaces/Comment";
import { Task } from "@/interfaces/Task";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { Controller, useForm } from "react-hook-form";
import { locales } from "@blocknote/core";
import { Button } from "@heroui/button";
import { useEffect } from "react";

export interface CreateTaskCommentProps {
  projectId: string;
  task: Task;
  submitFn: (data: CreateTaskCommentType) => void;
}

export default function CreateTaskComment({ projectId, task, submitFn }: CreateTaskCommentProps) {
  const {
    control,
    handleSubmit,
    setValue,
    resetField,
    watch,
    formState: { isSubmitSuccessful },
  } = useForm<CreateTaskCommentType>({
    defaultValues: {
      content: JSON.stringify([
        {
          type: "paragraph",
          props: { textColor: "default", backgroundColor: "default", textAlignment: "left" },
          content: [{ type: "text", text: " ", styles: {} }],
          children: [],
        },
      ]),
    },
  });

  const editor = useCreateBlockNote({
    initialContent: JSON.parse(watch("content")),
    dictionary: {
      ...locales["en"],
      placeholders: {
        ...locales["en"].placeholders,
        default: "Type a comment...",
      },
    },
  });


  const onSubmit = (data: CreateTaskCommentType) => {
    submitFn(data);

    editor.removeBlocks(editor.document)
  };

  return (
    <form
      className="space-y-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="border border-gray-200 rounded-lg p-4">
        <Controller
          name="content"
          control={control}
          render={() => {
            return (
              <BlockNoteView
                editor={editor}
                onChange={() => {
                  setValue("content", JSON.stringify(editor.document));
                }}
              />
            );
          }}
        />
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          color="primary"
          size="sm"
        >
          Comment
        </Button>
      </div>
    </form>
  );
}
