"use client";

import { Comment } from "@/interfaces/Comment";
import { useCreateBlockNote } from "@blocknote/react";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";

export interface TaskCommentItemProps {
  comment: Comment;
}

export default function TaskCommentItem({ comment }: TaskCommentItemProps) {
  const [html, setHtml] = useState<string>("");

  const editor = useCreateBlockNote({
    initialContent: JSON.parse(comment.content),
  });

  useEffect(() => {
    async function loadHtml() {
      const result = await editor.blocksToFullHTML(editor.document);
      setHtml(DOMPurify.sanitize(result));
    }
    loadHtml();
  }, [editor.document]);
  return <div className="border px-2 py-2 rounded-lg">
    <div dangerouslySetInnerHTML={{  __html: html }} />
  </div>;
}
