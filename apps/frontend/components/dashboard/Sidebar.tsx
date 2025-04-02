"use client";

import { useUser } from "@clerk/nextjs";
import { BarChart2, CheckSquare, ChevronRight, HomeIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const menus = [
  {
    lable: "Overview",
    slug: "/member/",
    icon: <HomeIcon className="h-6 w-6" />,
    isActive: true,
    role: "member",
  },
  {
    lable: "Tasks",
    slug: "/member/tasks",
    icon: <CheckSquare className="h-6 w-6" />,
    isActive: false,
    role: "member",
  },
  {
    lable: "Analytics",
    slug: "/member/analytics",
    icon: <BarChart2 className="h-6 w-6" />,
    isActive: false,
    role: "member",
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
        {menus.map(
          (menu) =>
            user?.publicMetadata?.role === menu.role && (
              <Link
                href={menu.slug}
                key={menu.slug}
                onClick={() => {
                  setActiveMenu(menu.slug);
                  console.log(menu.slug);
                }}
                className={`flex items-center justify-start gap-4 p-3 rounded-md transition 
                  ${
                    activeMenu === menu.slug
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
            )
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
