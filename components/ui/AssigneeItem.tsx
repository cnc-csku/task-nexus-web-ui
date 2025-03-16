import { Avatar } from "@heroui/avatar";

export interface AssigneeItemProps {
  name: string;
  position: string;
  profileUrl: string;
}

export default function AssigneeItem({ name, position, profileUrl }: AssigneeItemProps) {
  return (
    <div className="flex gap-3">
      <Avatar
        size="sm"
        src={profileUrl}
        className="w-12"
      />
      <div className="my-auto">
        <p className="text-sm">{name}</p>
        <p className="text-xs text-gray-500">{position}</p>
      </div>
    </div>
  );
}
