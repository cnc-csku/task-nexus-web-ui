"use client";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import Link from "next/link";
import { IoMdAdd } from "react-icons/io";
import { MdSearch } from "react-icons/md";

export interface ProjectsTableHeaderProps {
  workspaceId: string;
}

export default function ProjectsTableHeader({ workspaceId }: ProjectsTableHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <Input
        label="Search"
        size="sm"
        className="md:w-80"
        startContent={<MdSearch />}
      />
      <Button
        startContent={<IoMdAdd />}
        color="primary"
        as={Link}
        href={`/workspaces/${workspaceId}/projects/create`}
      >
        New Project
      </Button>
    </div>
  );
}
