"use client";

import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/table";
import { Link } from "@heroui/link";
import { Avatar } from "@heroui/avatar";
import { Chip } from "@heroui/chip";
import { useRouter } from "next/navigation";
import { Key } from "react";
import { Project } from "@/interfaces/Project";
import { ProjectStatus } from "@/enums/Project";

export interface ProjectsTableProps {
  projects: Project[];
}

export default function ProjectsTable({ projects }: ProjectsTableProps) {
  const router = useRouter();

  const rowNavigateAction = (key: Key) => {
    router.push(`/projects/${key.toString()}/board`);
  };

  return (
    <Table
      onRowAction={rowNavigateAction}
      selectionMode="single"
      aria-label="Projects Table"
    >
      <TableHeader>
        <TableColumn>Name</TableColumn>
        <TableColumn>Prefix</TableColumn>
        <TableColumn>Owner</TableColumn>
        <TableColumn className="text-center">Status</TableColumn>
      </TableHeader>
      <TableBody emptyContent={"No projects found"}>
        {projects.map((project) => (
          <TableRow key={project.id} className="cursor-pointer">
            <TableCell>{project.name}</TableCell>
            <TableCell>{project.projectPrefix}</TableCell>
            <TableCell>
              <Link className="text-sm">
                <Avatar
                  className="transition-transform mr-1"
                  size="sm"
                  src={project.ownerProfileUrl}
                />{" "}
                {project.ownerDisplayName}
              </Link>
            </TableCell>
            <TableCell className="text-center">
              <Chip
                color={project.status === ProjectStatus.Active ? "success" : "default"}
                variant="flat"
              >
                {project.status}
              </Chip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
