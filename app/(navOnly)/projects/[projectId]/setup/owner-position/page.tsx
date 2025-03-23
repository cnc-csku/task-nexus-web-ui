"use client";

import UpdateProjectOwnerPositionForm from "@/components/project/UpdateProjectOwnerPositionForm";
import LoadingScreen from "@/components/ui/LoadingScreen";
import useFindProjectById from "@/hooks/api/project/useFindProjectById";
import useUpdateProjectMemberPosition from "@/hooks/api/project/useUpdateProjectMemberPosition";
import { UpdateProjectMemberPositionType, UpdateProjectPositionsType } from "@/interfaces/Project";
import { getApiErrorMessage } from "@/utils/errutils";
import { Divider } from "@heroui/divider";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SetupOwnerPosition() {
  const { projectId } = useParams<{ projectId: string }>();
  const router = useRouter();

  const { data: project, isPending, error } = useFindProjectById(projectId);

  const { mutateAsync, isPending: isUpdatePending } = useUpdateProjectMemberPosition({
    projectId: projectId,
  });

  if (isPending) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  const handleUpdateProjectOwnerPosition = async (data: UpdateProjectMemberPositionType) => {
    try {
      await mutateAsync({
        userId: project.ownerUserId,
        position: data.position,
      });
      router.push(`/projects/${projectId}/setup/workflows`);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      return;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)]">
      <div className="lg:w-[500px] pb-5">
        <motion.div
          className="flex flex-col gap-5 px-1"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2">
            <Divider className="inline-block w-5" />
            <h3>Step 3</h3>
          </div>
          <h1 className="text-2xl mb-5">Setup Owner Position</h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <UpdateProjectOwnerPositionForm
            projectId={projectId}
            ownerUserId={project.ownerUserId}
            allPositions={project.positions}
            isLoading={isUpdatePending}
            submitFn={handleUpdateProjectOwnerPosition}
          />
        </motion.div>
      </div>
    </div>
  );
}
