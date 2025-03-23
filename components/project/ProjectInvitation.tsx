import useWorkspaceMembers from "@/hooks/api/workspace/useWorkspaceMembers";
import { InviteProjectMemberType, Project, ProjectMember } from "@/interfaces/Project";
import { WorkspaceMember } from "@/interfaces/Workspace";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import LoadingScreen from "../ui/LoadingScreen";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { ProjectMemberRole } from "@/enums/Project";
import useInviteProjectMember from "@/hooks/api/project/useInviteProjectMember";
import { useForm } from "react-hook-form";
import { getApiErrorMessage } from "@/utils/errutils";
import { toast } from "sonner";

interface ProjectInvitationProps {
  project: Project;
  projectMembers: ProjectMember[];
}

export default function ProjectInvitation({ project, projectMembers }: ProjectInvitationProps) {
  const {
    data: workspaceMembersResponse,
    isPending: isPendingAllMembers,
    error: errorAllMembers,
  } = useWorkspaceMembers(project.workspaceId);

  const { mutateAsync: inviteProjectMember, isPending: isPendingInviteProjectMember } =
    useInviteProjectMember(project.id);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<InviteProjectMemberType>();

  const submitFn = async (data: InviteProjectMemberType) => {
    try {
      await inviteProjectMember({
        members: [data],
      });
      reset();
      toast.success("Invitation sent successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  if (isPendingAllMembers) {
    return <LoadingScreen />;
  }

  if (errorAllMembers) {
    return <div>Error: {errorAllMembers.message}</div>;
  }

  const allMembers = workspaceMembersResponse.members;

  const notInProjectMembers = allMembers.filter(
    (member) => !projectMembers.some((pm) => pm.userId === member.userId)
  );

  return (
    <form
      onSubmit={handleSubmit(submitFn)}
      className="flex gap-2 px-4 py-3 bg-white rounded-xl border border-gray-200 mb-3"
    >
      <Autocomplete
        label="Invite members"
        aria-label="Invite members"
        isRequired
        isInvalid={!!errors.userId}
        errorMessage={errors.userId?.message}
        selectedKey={watch("userId")}
        onSelectionChange={(value) => setValue("userId", value?.toString() ?? "")}
      >
        {notInProjectMembers.map((member) => (
          <AutocompleteItem
            key={member.userId}
            textValue={member.fullName + " (" + member.email + ")"}
          >
            {member.fullName} ({member.email})
          </AutocompleteItem>
        ))}
      </Autocomplete>
      <Select
        label="Role"
        aria-label="Role"
        isRequired
        isInvalid={!!errors.role}
        errorMessage={errors.role?.message}
        {...register("role")}
      >
        {Object.values(ProjectMemberRole).map((role) => (
          <SelectItem
            key={role}
            textValue={role}
          >
            {role}
          </SelectItem>
        ))}
      </Select>
      <Autocomplete
        label="Position"
        aria-label="Position"
        isRequired
        isInvalid={!!errors.position}
        errorMessage={errors.position?.message}
        {...register("position")}
      >
        {project.positions.map((position) => (
          <AutocompleteItem
            key={position}
            textValue={position}
          >
            {position}
          </AutocompleteItem>
        ))}
      </Autocomplete>

      <Button
        type="submit"
        color="primary"
        className=" my-auto"
        isLoading={isPendingInviteProjectMember}
      >
        Invite
      </Button>
    </form>
  );
}
