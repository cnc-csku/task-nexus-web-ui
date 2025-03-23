import { WorkspaceMemberDetail } from "@/interfaces/Workspace";
import { Avatar } from "@heroui/avatar";
import { Table, TableCell, TableBody, TableColumn, TableHeader, TableRow } from "@heroui/table";

export interface WorkspaceMemberListProps {
  members: WorkspaceMemberDetail[];
}

export default function WorkspaceMemberList({ members }: WorkspaceMemberListProps) {
  return (
    <Table>
      <TableHeader>
        <TableColumn>Name</TableColumn>
        <TableColumn>Email</TableColumn>
        <TableColumn>Role</TableColumn>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.workspaceMemberId}>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar
                  src={member.profileUrl}
                  name={member.fullName}
                  size="sm"
                />
                <div className="text-sm">{member.fullName}</div>
              </div>
            </TableCell>
            <TableCell>{member.email}</TableCell>
            <TableCell>{member.role}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
