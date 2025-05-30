"use client";

import { MdAnalytics, MdSettings, MdTimeline, MdDashboard } from "react-icons/md";
import { GoTasklist } from "react-icons/go";
import SideBarItem from "./SideBarItem";
import { Button } from "@heroui/button";
import { useParams } from "next/navigation";
import { IoMdArrowRoundBack } from "react-icons/io";
import Link from "next/link";

export interface SideBarProps {
  isOpen: boolean;
}
export default function SideBar({ isOpen }: SideBarProps) {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <>
      {isOpen && (
        <div className="w-full bg-white border-r-1 border-gray-200 h-screen px-5 py-6 flex flex-col justify-between">
          <div>
            {/* Add back to all project button */}
            <Button
              variant="light"
              isIconOnly
              as={Link}
              href="/workspaces"
            >
              <IoMdArrowRoundBack className="text-lg" />
            </Button>
            <div className="mt-3 flex flex-col gap-2">
              <SideBarItem
                name="Board"
                href={`/projects/${projectId}/board`}
                startIcon={<MdDashboard className="text-lg" />}
              />
              <SideBarItem
                name="Tasks"
                href={`/projects/${projectId}/tasks`}
                startIcon={<GoTasklist className="text-lg" />}
              />
              {/* <SideBarItem
                name="Timeline"
                href={`/projects/${projectId}/timeline`}
                startIcon={<MdTimeline className="text-lg" />}
              /> */}
              <SideBarItem
                name="Report"
                href={`/projects/${projectId}/report`}
                startIcon={<MdAnalytics className="text-lg" />}
              />
            </div>
          </div>
          <div>
            <SideBarItem
              name="Project Setting"
              href={`/projects/${projectId}/settings`}
              startIcon={<MdSettings className="text-lg" />}
            />
          </div>
        </div>
      )}
    </>
  );
}
