import React from "react";
import { InvitationActionType, UserInvitation } from "@/interfaces/Workspace";
import useInvitationAction from "@/hooks/api/workspace/useInvitationAction";
import { Button } from "@heroui/button";
import { SlCheck, SlClose } from "react-icons/sl";
import { MdCheck, MdClose } from "react-icons/md";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/errutils";

export interface InvitationItemProps {
  invitation: UserInvitation;
}

export default function InvitationItem({ invitation }: InvitationItemProps) {
  const { mutateAsync: invitationAction } = useInvitationAction();

  const onAction = async (action: "ACCEPT" | "REJECT") => {
    try {
      await invitationAction({
        invitationId: invitation.invitationId,
        action: action,
      });
      toast.success("Invitation action successful");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <div className="border border-gray-300 rounded-2xl px-5 py-4 w-full h-full">
        {invitation.workspaceName}
      </div>
      <Button
        isIconOnly
        color="primary"
        onPress={() => onAction("ACCEPT")}
      >
        <MdCheck />
      </Button>
      <Button
        isIconOnly
        color="danger"
        onPress={() => onAction("REJECT")}
      >
        <MdClose />
      </Button>
    </div>
  );
}
