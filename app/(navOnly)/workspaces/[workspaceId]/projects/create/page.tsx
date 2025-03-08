"use client";

import CreateProjectForm from "@/components/project/CreateProjectForm";
import useCreateProject from "@/hooks/api/project/useCreateProject";
import { CreateProjectType } from "@/interfaces/Project";
import { getApiErrorMessage } from "@/utils/errutils";
import { Divider } from "@heroui/divider";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateProjectPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { isPending, mutateAsync } = useCreateProject();
  const router = useRouter();

  const handleCreateProject = async (data: CreateProjectType) => {
    try {
      const response = await mutateAsync(data);
      router.replace(`/projects/${response.id}/setup/positions`);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      return;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)]">
      <div className="lg:w-[500px]">
        <motion.div
          className="flex flex-col gap-5 px-1"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2">
            <Divider className="inline-block w-5" />
            <h3>Step 1</h3>
          </div>
          <h1 className="text-2xl mb-5">Create new project</h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <CreateProjectForm
            submitFn={handleCreateProject}
            workspaceId={workspaceId}
            isLoading={isPending}
          />
        </motion.div>
      </div>
    </div>
  );
}
