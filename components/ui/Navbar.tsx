"use client";
import { Navbar as NextNav, NavbarContent, NavbarItem } from "@heroui/navbar";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { Avatar } from "@heroui/avatar";
import { User } from "@heroui/user";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Button } from "@heroui/button";
import { Badge } from "@heroui/badge";
import { MdMenu } from "react-icons/md";
import { signOut, useSession } from "next-auth/react";
export interface NavbarProps {
  sideBarToggle?: () => void;
}

export default function Navbar({ sideBarToggle }: NavbarProps) {
  const { data: session, status } = useSession();

  return (
    <NextNav
      maxWidth="full"
      className="bg-white"
    >
      {sideBarToggle && (
        <NavbarContent>
          <Button
            variant="light"
            isIconOnly
            onPress={sideBarToggle}
          >
            <MdMenu className="text-xl cursor-pointer" />
          </Button>
        </NavbarContent>
      )}
      <NavbarContent justify="end">
        {/* <NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button
                variant="light"
                size="sm"
                isIconOnly
              >
                <Badge
                  color="danger"
                  content="3"
                  shape="circle"
                  placement="bottom-right"
                  size="sm"
                >
                  <IoMdNotificationsOutline className="text-xl cursor-pointer" />
                </Badge>
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Notifications"
              variant="flat"
            >
              <DropdownItem key="notification1">Notification 1</DropdownItem>
              <DropdownItem key="notification2">Notification 2</DropdownItem>
              <DropdownItem key="notification3">Notification 3</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem> */}
        <NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                as="button"
                className="transition-transform"
                size="sm"
                src={session?.user?.profileUrl || ""}
              />
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Profile Actions"
              variant="flat"
            >
              <DropdownItem
                key="profile"
                isReadOnly
              >
                <User
                  avatarProps={{
                    size: "sm",
                    src: session?.user?.profileUrl || "",
                  }}
                  classNames={{
                    name: "text-default-600",
                    description: "text-default-500",
                  }}
                  name={session?.user?.displayName || ""}
                  description={session?.user?.email || ""}
                />
              </DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                onPress={() => signOut({
                  redirect: true,
                  callbackUrl: "/auth/login",
                })}
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </NextNav>
  );
}
