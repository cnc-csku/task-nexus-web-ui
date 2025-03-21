"use client";

import UpdateProjectAttributesForm from "@/components/project/UpdateProjectAttributesForm";
import LoadingScreen from "@/components/ui/LoadingScreen";
import useFindProjectById from "@/hooks/api/project/useFindProjectById";
import useUpdateProjectAttributesTemplate from "@/hooks/api/project/useUpdateProjectAttributesTemplate";
import { UpdateProjectAttributesTemplatesType } from "@/interfaces/Project";
import { getApiErrorMessage } from "@/utils/errutils";
import { Divider } from "@heroui/divider";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SetupProjectAttributes() {
  const { projectId } = useParams<{ projectId: string }>();
  const router = useRouter();

  const { data: project, isPending, error } = useFindProjectById(projectId);
  const { mutateAsync, isPending: isUpdatePending } = useUpdateProjectAttributesTemplate({
    projectId,
  });

  if (isPending) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  console.log(project);

  const handleUpdateProjectAttributes = async (data: UpdateProjectAttributesTemplatesType) => {
    try {
      await mutateAsync(data);
      router.push(`/projects/${projectId}/tasks`);
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
            <h3>Step 4</h3>
          </div>
          <h1 className="text-2xl mb-5">Setup Project Attributes Template</h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <UpdateProjectAttributesForm
            projectId={projectId}
            isLoading={isUpdatePending}
            projectAttributes={project.attributesTemplates}
            submitFn={handleUpdateProjectAttributes}
          />
        </motion.div>
      </div>
    </div>
  );
}
