import useListUserInvitation from "@/hooks/api/workspace/useListUserInvitation";
import LoadingScreen from "../ui/LoadingScreen";
import { UserInvitation } from "@/interfaces/Workspace";
import InvitationItem from "./InvitationItem";

export default function WorkspaceMemberInvitationActions() {
  const { data, isPending, error } = useListUserInvitation();

  if (isPending) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const invitations = data.invitations;

  const pendingInvitations = invitations.filter(
    (invitation: UserInvitation) => invitation.status === "PENDING"
  );

  return (
    <div className="flex flex-col gap-2">
      <h2 className={`text-lg ${pendingInvitations.length > 0 ? "block" : "hidden"}`}>Pending Invitations</h2>
      {pendingInvitations.map((invitation: UserInvitation) => {
        return (
          <InvitationItem
            key={invitation.invitationId}
            invitation={invitation}
          />
        );
      })}
    </div>
  );
}
