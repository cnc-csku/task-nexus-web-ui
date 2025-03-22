import { SprintStatus } from "@/enums/Sprint";
import { Sprint } from "@/interfaces/Sprint";
import { formatDateAsMMMDDYYYY } from "@/utils/timeUtils";
import { FaPlay } from "react-icons/fa6";

export interface SprintHeaderProps {
  sprint: Sprint;
}

export default function SprintHeader({ sprint }: SprintHeaderProps) {
  return (
    <div className="flex justify-start items-center gap-1 ">
      <div>
        {sprint.status === SprintStatus.InProgress && (
          <FaPlay className="bg-gray-100 p-[3px] rounded text-gray-700" />
        )}
      </div>
      <div>{sprint.title}</div>
      <div>
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
