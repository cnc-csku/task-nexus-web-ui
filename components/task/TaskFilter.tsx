"use client";

import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Switch } from "@heroui/switch";
import { IoIosSearch } from "react-icons/io";
import AssigneeItem from "@/components/ui/AssigneeItem";
import { ProjectMember } from "@/interfaces/Project";
import { Dispatch, Key, SetStateAction, useEffect, useState } from "react";
import type { Selection } from "@heroui/table";

export interface TaskFilterProps {
  members: ProjectMember[];
  positions: string[];
  statuses: string[];
  isShowEpics?: boolean;
  setShowIsEpics?: Dispatch<SetStateAction<boolean>>;
  selectedPositions: string[];
  setSelectedPositions: Dispatch<SetStateAction<Array<string>>>;
  selectedAssignees: string[];
  setSelectedAssignees: Dispatch<SetStateAction<Array<string>>>;
  selectedStatuses: string[];
  setSelectedStatuses: Dispatch<SetStateAction<Array<string>>>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}

export default function TaskFilter({
  members,
  positions,
  statuses,
  isShowEpics,
  setShowIsEpics,
  selectedPositions,
  setSelectedPositions,
  selectedAssignees,
  setSelectedAssignees,
  selectedStatuses,
  setSelectedStatuses,
  search,
  setSearch,
}: TaskFilterProps) {
  const [filteredMembers, setFilteredMembers] = useState<ProjectMember[]>(members);

  useEffect(() => {
    if (selectedPositions.length > 0) {
      const filtered = members.filter((member) => selectedPositions.includes(member.position));

      setFilteredMembers(filtered);

      // Remove assignees that are not in the filtered positions
      selectedAssignees.forEach((assignee) => {
        // Search for the assignee in from the filtered members
        const member = members.find((member) => member.userId === assignee);

        // If the assignee is not in the filtered members, remove it
        if (!member) {
          return;
        }

        // If the assignee is in the filtered members but not in the selected positions, remove it
        if (!selectedPositions.includes(member.position)) {
          setSelectedAssignees(selectedAssignees.filter((assignee) => assignee !== member.userId));
        }
      });
    } else {
      setFilteredMembers(members);
    }
  }, [selectedPositions, selectedAssignees, members]);

  const onSelectedAssigneesChange = (selected: Selection) => {
    const data = selected as Set<Key>;

    setSelectedAssignees(Array.from(data).map((key) => key.toString()));
  };

  const onSelectedPositionsChange = (selected: Selection) => {
    const data = selected as Set<Key>;

    setSelectedPositions(Array.from(data).map((key) => key.toString()));
  };

  const onSelectedStatusChange = (selected: Selection) => {
    const data = selected as Set<Key>;

    setSelectedStatuses(Array.from(data).map((key) => key.toString()));
  };

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="mb-5 grid grid-cols-3 gap-4 items-center">
      <div>
        <Input
          className="w-full"
          placeholder="Search"
          startContent={<IoIosSearch />}
          onChange={onSearchChange}
          value={search}
        />
      </div>
      <div className="flex gap-3 col-span-2 justify-end">
        {isShowEpics !== undefined && (
          <Switch
            size="sm"
            className="w-full"
            aria-label="Set show epics switch"
            onValueChange={setShowIsEpics}
            isSelected={isShowEpics}
          >
            Show Epics
          </Switch>
        )}
        <Select
          name="status"
          label="Filter Status"
          size="sm"
          selectionMode="multiple"
          disallowEmptySelection
          className="w-48"
          value={selectedStatuses}
          onSelectionChange={onSelectedStatusChange}
          defaultSelectedKeys={selectedStatuses}
        >
          {statuses.map((status) => (
            <SelectItem
              key={status}
              textValue={status}
            >
              {status}
            </SelectItem>
          ))}
        </Select>
        <Select
          name="positions"
          label="Filter Positions"
          size="sm"
          className="w-48"
          selectionMode="multiple"
          selectedKeys={selectedPositions}
          onSelectionChange={onSelectedPositionsChange}
        >
          {positions.map((position) => (
            <SelectItem
              key={position}
              textValue={position}
            >
              {position}
            </SelectItem>
          ))}
        </Select>
        <Select
          name="assignees"
          label="Filter Assignees"
          size="sm"
          className="w-48"
          selectionMode="multiple"
          selectedKeys={selectedAssignees}
          onSelectionChange={onSelectedAssigneesChange}
        >
          {filteredMembers.map((member) => (
            <SelectItem
              key={member.userId}
              textValue={member.displayName}
            >
              <AssigneeItem
                key={member.userId}
                profileUrl={member.profileUrl}
                name={member.displayName}
                position={member.position}
              />
            </SelectItem>
          ))}
        </Select>
      </div>
    </div>
  );
}
