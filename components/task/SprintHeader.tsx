import { Sprint } from "@/interfaces/Sprint";
import { formatDateAsMMMDDYYYY } from "@/utils/timeUtils";

export interface SprintHeaderProps {
  sprint: Sprint;
}

export default function SprintHeader({ sprint }: SprintHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        {sprint.title}
        {sprint.startDate && sprint.endDate && (
          <span className="text-gray-400 ml-2">
            {`${formatDateAsMMMDDYYYY(sprint.startDate)} - ${formatDateAsMMMDDYYYY(
              sprint.endDate
            )}`}
          </span>
        )}
      </div>
    </div>
  );
}
