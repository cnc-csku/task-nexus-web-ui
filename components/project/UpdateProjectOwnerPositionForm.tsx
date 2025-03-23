import { UpdateProjectMemberPositionType } from "@/interfaces/Project";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { useForm } from "react-hook-form";

interface UpdateProjectOwnerPositionFormProps {
  projectId: string;
  ownerUserId: string;
  allPositions: string[];
  isLoading: boolean;
  submitFn: (data: UpdateProjectMemberPositionType) => void;
}

export default function UpdateProjectOwnerPositionForm({
  isLoading,
  allPositions,
  submitFn,
}: UpdateProjectOwnerPositionFormProps) {
  const { register, handleSubmit } = useForm<UpdateProjectMemberPositionType>();

  return (
    <form
      onSubmit={handleSubmit(submitFn)}
      className="flex flex-col gap-5"
    >
      <Select
        label="Owner Position"
        placeholder="Select a position"
        isRequired
        {...register("position")}
      >
        {allPositions.map((position) => (
          <SelectItem
            key={position}
            textValue={position}
          >
            {position}
          </SelectItem>
        ))}
      </Select>
      <Button
        type="submit"
        color="primary"
        fullWidth
        size="lg"
        isLoading={isLoading}
      >
        Update
      </Button>
    </form>
  );
}
