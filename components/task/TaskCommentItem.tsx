"use client";

import { Comment } from "@/interfaces/Comment";
import { useCreateBlockNote } from "@blocknote/react";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { Avatar } from "@heroui/avatar";
import { timeAgo } from "@/utils/timeUtils";

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

  return (
    <div className="flex gap-2">
      <div>
        <Avatar
          src={comment.userProfileUrl}
          alt={comment.userDisplayName}
        />
      </div>
      <div className="grid w-full gap-2">
        <div className="flex items-center gap-2">
          <div className="text-sm">{comment.userDisplayName}</div>
          <div className="text-sm text-gray-400">{timeAgo(comment.createdAt)}</div>
        </div>
        <div className="border px-2 py-2 rounded-lg">
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </div>
  );
}
