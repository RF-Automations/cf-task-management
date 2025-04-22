"use client";

import { useUser } from "@clerk/nextjs";
import { BarChart2, CheckSquare, ChevronRight, HomeIcon, Users } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const menus = [
  {
    lable: "Overview",
    slug: ["/member", "/admin", "/moderator"],
    icon: <HomeIcon className="h-5 w-5 font-bold" />,
    isActive: true,
    role: ["member", "admin", "moderator"],
  },
  {
    lable: "Users",
    slug: ["/admin/users", "/moderator/users"],
    icon: <Users className="h-5 w-5 font-bold" />,
    isActive: true,
    role: ["admin", "moderator"],
  },
  {
    lable: "Tasks",
    slug: ["/member/tasks", "/admin/tasks", "/moderator/tasks"],
    icon: <CheckSquare className="h-5 w-5 font-bold" />,
    isActive: false,
    role: ["member", "admin", "moderator"],
  },
  {
    lable: "Analytics",
    slug: ["/member/analytics", "/admin/analytics", "/moderator/analytics"],
    icon: <BarChart2 className="h-5 w-5 font-bold" />,
    isActive: false,
    role: ["member", "admin", "moderator"],
  },
];

const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState("home");
  const [isOpen, setIsOpen] = useState(true);

  const { user } = useUser();

  return (
    <aside
      className={`h-full text-black transition-all rounded-md duration-300 hidden md:flex flex-col ${
        isOpen
          ? "w-64 items-end"
          : "w-18 border border-border bg-gray-50 h-fit items-center pt-2"
      }`}
    >
      <div
        className="p-1 bg-slate-100 border border-border rounded-md w-fit h-fit cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ChevronRight className={`h-6 w-6 ${!isOpen && "rotate-180"}`} />
      </div>

      <nav className="flex flex-col h-full p-4 gap-2 w-full justify-start items-center pt-6">
        {menus.map((menu) => {
          const currentRole = user?.publicMetadata?.role as string;
          const slug =
            menu.slug[menu.role.indexOf(user?.publicMetadata?.role as string)];
          if (menu.role.includes(currentRole)) {
            return (
              <Link
                href={slug}
                key={slug}
                onClick={() => {
                  setActiveMenu(slug);
                }}
                className={`flex items-center justify-start gap-4 p-3 rounded-md transition 
                    ${
                      activeMenu === slug
                        ? "bg-slate-200 hover:bg-gray-300"
                        : "hover:bg-gray-200"
                    }
                    ${isOpen ? "w-full" : "w-fit"}`}
              >
                <div className="w-fit flex justify-center items-center">
                  {menu.icon}
                </div>
                {isOpen && <span>{menu.lable}</span>}
              </Link>
            );
          }
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
