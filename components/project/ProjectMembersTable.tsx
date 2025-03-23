import { ProjectMember } from "@/interfaces/Project";
import { Table, TableCell, TableBody, TableColumn, TableHeader, TableRow } from "@heroui/table";

interface ProjectMembersTableProps {
  projectMembers: ProjectMember[];
}

export default function ProjectMembersTable({ projectMembers }: ProjectMembersTableProps) {
  return <div>
    <Table>
        <TableHeader>
            <TableColumn>Name</TableColumn>
            <TableColumn>Email</TableColumn>
            <TableColumn>Role</TableColumn>
        </TableHeader>
        <TableBody>
            {projectMembers.map((member) => (
                <TableRow key={member.userId}>
                    <TableCell>{member.fullName}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.role}</TableCell>
                </TableRow>
            ))} 
        </TableBody>
    </Table>
  </div>;
}
