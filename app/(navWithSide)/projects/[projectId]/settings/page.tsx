"use client";

import ProjectMembersSetting from "@/components/project/ProjectMembersSetting";
import { Tab, Tabs } from "@heroui/tabs";
import { useParams } from "next/navigation";

export default function ProjectSettingsPage() {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <div>
      <div className="text-xl font-medium mb-5">Project Settings</div>
      <div className="flex w-full flex-col">
        <Tabs aria-label="Options">
          <Tab
            key="members"
            title="Members"
          >
            <ProjectMembersSetting projectId={projectId} />
          </Tab>
          <Tab
            key="info"
            title="Info"
          ></Tab>
        </Tabs>
      </div>
    </div>
  );
}
