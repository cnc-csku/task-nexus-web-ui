import { Comment } from "@/interfaces/Comment";
import TaskCommentItem from "./TaskCommentItem";

export interface TaskCommentListProps {
  comments: Comment[];
}

export default function TaskCommentList({ comments }: TaskCommentListProps) {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <TaskCommentItem
          key={comment.id}
          comment={comment}
        />
      ))}
    </div>
  );
}
