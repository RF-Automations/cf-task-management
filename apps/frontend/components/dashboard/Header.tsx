"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import React from "react";
import { BarChart2, CheckSquare, HomeIcon, Terminal } from "lucide-react";
import { Button } from "../ui/button";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";

const menus = [
  {
    lable: "Overview",
    slug: "/member/",
    icon: <HomeIcon className="h-4 w-4 font-bold" />,
    isActive: true,
    role: "member",
  },
  {
    lable: "Tasks",
    slug: "/member/tasks",
    icon: <CheckSquare className="h-4 w-4 font-bold" />,
    isActive: false,
    role: "member",
  },
  {
    lable: "Analytics",
    slug: "/member/analytics",
    icon: <BarChart2 className="h-4 w-4 font-bold" />,
    isActive: false,
    role: "member",
  },
];

const DashboardHeader = () => {
  const { user } = useUser();

  const role = user?.publicMetadata?.role || "member";

  const router = useRouter();

  return (
    <header className="flex justify-between items-center p-4 gap-4 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-8">
      <div className="flex items-center space-x-2 cursor-pointer">
        <Terminal className="h-6 w-6" />
        <span className="font-bold hidden md:block">CF Dashboard</span>
        <p className="text-sm block md:hidden font-bold">
          {(role as string).charAt(0).toUpperCase() +
            (role as string).slice(1, (role as string).length)}{" "}
          Dashboard
        </p>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex gap-3">
            <div className="flex-col justify-center items-end hidden md:flex">
              <h1 className="text-xl font-bold w-fit">
                Welcome, {user?.firstName as string}
              </h1>
              <p className="text-muted-foreground text-sm">
                {(role as string).charAt(0).toUpperCase() +
                  (role as string).slice(1, (role as string).length)}{" "}
                Dashboard
              </p>
            </div>
            <SignedOut>
              <Button variant="secondary">
                <SignInButton />
              </Button>
              <Button variant="secondary">
                <SignUpButton />
              </Button>
            </SignedOut>
          </div>
          <SignedIn>
            <UserButton>
              <UserButton.MenuItems>
                {menus.map(
                  (menu) =>
                    user?.publicMetadata?.role === menu.role && (
                      <UserButton.Action
                        key={menu.slug}
                        label={menu.lable}
                        labelIcon={menu.icon}
                        onClick={() => router.push(menu.slug)}
                      />
                    )
                )}
                <UserButton.Action
                  label="Notifications"
                  labelIcon={<Bell className="h-4 w-4 font-bold" />}
                  onClick={() => alert("Notifications clicked")}
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
