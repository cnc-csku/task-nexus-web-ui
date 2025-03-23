import { WorkspaceMemberRole } from "@/enums/Workspace";
import { Select, SelectItem } from "@heroui/select";
import { InviteWorkspaceMemberFormType } from "@/interfaces/Workspace";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useForm } from "react-hook-form";
import useInviteWorkspaceMember from "@/hooks/api/workspace/useInviteWorkspaceMember";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/errutils";

export interface InviteWorkspaceMemberProps {
  workspaceId: string;
}
export default function InviteWorkspaceMember({ workspaceId }: InviteWorkspaceMemberProps) {
  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<InviteWorkspaceMemberFormType>();
  const { mutateAsync: inviteWorkspaceMember, isPending } = useInviteWorkspaceMember();

  const submitFn = async (data: InviteWorkspaceMemberFormType) => {
    try {
      await inviteWorkspaceMember(data);
      toast.success("Invitation sent successfully");
      resetField("inviteeEmail");
      resetField("role");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitFn)}
      className="flex gap-2 px-3 py-5 bg-white rounded-xl border border-gray-200 mb-2 shadow-sm items-center"
    >
      <input
        type="hidden"
        value={workspaceId}
        {...register("workspaceId")}
      />
      <Input
        label="Email"
        placeholder="Enter email address"
        type="email"
        isRequired
        isInvalid={!!errors.inviteeEmail}
        errorMessage={errors.inviteeEmail?.message}
        {...register("inviteeEmail")}
      />
      <Select
        label="Role"
        placeholder="Select role"
        isRequired
        isInvalid={!!errors.role}
        errorMessage={errors.role?.message}
        {...register("role")}
      >
        {Object.values(WorkspaceMemberRole).map((role) => (
          <SelectItem
            key={role}
            textValue={role}
          >
            {role}
          </SelectItem>
        ))}
      </Select>
      <Button
        type="submit"
        size="lg"
        color="primary"
        isDisabled={!!errors.inviteeEmail || !!errors.role}
        isLoading={isPending}
      >
        Invite
      </Button>
    </form>
  );
}
