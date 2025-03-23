"use client";

import LoadingScreen from "@/components/ui/LoadingScreen";
import InviteWorkspaceMember from "@/components/workspace/InviteWorkspaceMember";
import WorkspaceMemberList from "@/components/workspace/WorkspaceMemberList";
import useWorkspaceMembers from "@/hooks/api/workspace/useWorkspaceMembers";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import React from "react";

export default function WorkspaceSettingsPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const { data: members, isPending, error } = useWorkspaceMembers(workspaceId);

  if (isPending) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
      <div className="lg:w-[800px]">
        <motion.div
          className="flex flex-col gap-5 px-1"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-2xl mb-5">Workspace Invitations</h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <InviteWorkspaceMember workspaceId={workspaceId} />
          <WorkspaceMemberList members={members.members} />
        </motion.div>
      </div>
    </div>
  );
}
