"use client";

import { Task } from "@/interfaces/Task";
import CreateTaskComment from "./CreateTaskComment";
import useTaskCommentByTaskRef from "@/hooks/api/taskComment/useTaskCommentByTaskRef";
import LoadingScreen from "../ui/LoadingScreen";
import TaskCommentList from "./TaskCommentList";
import useCreateTaskComment from "@/hooks/api/taskComment/useCreateTaskComment";
import { CreateTaskCommentType } from "@/interfaces/Comment";

export interface TaskCommentsProps {
  projectId: string;
  task: Task;
}

export default function TaskComments({ projectId, task }: TaskCommentsProps) {
  const {
    data: commments,
    isPending: isCommentsPending,
    error: commentsError,
  } = useTaskCommentByTaskRef(projectId, task.taskRef);

  const { mutateAsync: createTaskComment, isPending: isCreateTaskCommentPending } =
    useCreateTaskComment(projectId, task.taskRef);

  if (isCommentsPending) {
    return <LoadingScreen />;
  }

  if (commentsError) {
    return <div>Error loading comments</div>;
  }

  const handleCreateTaskComment = async (data: CreateTaskCommentType) => {
    await createTaskComment(data);
  }

  return (
    <div className="space-y-5">
      <div>
        <TaskCommentList comments={commments!} />
      </div>
      <div>
        <CreateTaskComment
          projectId={projectId}
          task={task}
          submitFn={handleCreateTaskComment}
        />
      </div>
    </div>
  );
}
