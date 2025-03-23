import { useForm } from "react-hook-form";
import { ApproveTaskSchema, ApproveTaskType } from "@/interfaces/Task";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { IoMdCheckmark } from "react-icons/io";
import { zodResolver } from "@hookform/resolvers/zod";

export interface ApproveTaskFormProps {
  submitFn: (data: ApproveTaskType) => void;
}

export default function ApproveTaskForm({ submitFn }: ApproveTaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApproveTaskType>({
    resolver: zodResolver(ApproveTaskSchema),
  });

  return (
    <form
      onSubmit={handleSubmit(submitFn)}
      className="flex flex-col gap-4"
    >
      <Input
        label="Reason"
        placeholder="Reason"
        isRequired
        errorMessage={errors.reason?.message}
        isInvalid={!!errors.reason}
        {...register("reason")}
      />
      <Button
        type="submit"
        color="primary"
        startContent={<IoMdCheckmark />}
      >
        Approve
      </Button>
    </form>
  );
}
