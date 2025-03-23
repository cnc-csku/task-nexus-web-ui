"use client";

import { Task } from "@/interfaces/Task";
import { useCreateBlockNote } from "@blocknote/react";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { BlockNoteView } from "@blocknote/mantine";
import { Button } from "@heroui/button";
import useUpdateTaskDetail from "@/hooks/api/task/useUpdateTaskDetail";

export interface EditableDescriptionProps {
  projectId: string;
  task: Task;
}

export default function EditableDescription({ projectId, task }: EditableDescriptionProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [html, setHtml] = useState<string>("");

  const editor = useCreateBlockNote({
    initialContent: JSON.parse(task.description),
  });

  useEffect(() => {
    async function loadHtml() {
      const result = await editor.blocksToFullHTML(editor.document);
      setHtml(DOMPurify.sanitize(result));
    }
    loadHtml();
  }, [editor.document]);

  const { mutateAsync: updateTaskDetail, isPending: isUpdate } = useUpdateTaskDetail(
    projectId,
    task.taskRef
  );

  const onSave = async () => {
    await updateTaskDetail({
      title: task.title,
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
      startDate: task.startDate ? new Date(task.startDate) : null,
      description: JSON.stringify(editor.document),
    });

    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <div>
          <BlockNoteView editor={editor} />
          <div className="flex justify-end mt-2 gap-2">
            <Button
              onPress={() => onSave()}
              color="primary"
              size="sm"
            >
              Save
            </Button>
            <Button
              onPress={() => setIsEditing(false)}
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div
          dangerouslySetInnerHTML={{ __html: html }}
          className="cursor-pointer hover:bg-gray-50 p-2"
          onClick={() => setIsEditing(true)}
        />
      )}
    </div>
  );
}
