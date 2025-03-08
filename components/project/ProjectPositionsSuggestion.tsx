"use client";

import { Chip } from "@heroui/chip";
import { HiOutlinePlusSm } from "react-icons/hi";

export interface ProjectPositionsSuggestionProps {
  positions: string[];
  appendFn: (position: string) => void;
}

export default function ProjectPositionsSuggestion({ positions, appendFn }: ProjectPositionsSuggestionProps) {
  const positionsSuggestion = [
    "Frontend Developer",
    "Backend Developer",
    "UI/UX Designer",
    "Project Manager",
    "Quality Assurance",
    "Business Analyst",
    "Scrum Master",
    "Product Owner",
    "Data Analyst",
    "DevOps Engineer",
    "System Analyst",
    "Database Administrator",
  ];

  const filteredPositions = positionsSuggestion.filter((position) => !positions.includes(position));

  return (
    <div className="flex flex-wrap gap-2">
      {filteredPositions.map((position) => {
        return (
          <Chip
            key={position}
            color="default"
            variant="flat"
            endContent={<HiOutlinePlusSm />}
            className="pr-2 cursor-pointer"
            onClick={() => appendFn(position)}
          >
            {position}
          </Chip>
        );
      })}
    </div>
  );
}
