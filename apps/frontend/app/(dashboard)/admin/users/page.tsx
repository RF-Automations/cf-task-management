"use client";

import { columns } from "@/components/dashboard/admin/users-column";
import { DataTable } from "@/components/data-table/data-table";
import { User } from "@/types/common";
import React from "react";

export default function UserPage() {
  const users: User[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      status: "pending",
      createdAt: new Date("2024-01-01"),
      lastActive: new Date("2024-03-15"),
      banned: false,
      approved: true
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      status: "approved",
      createdAt: new Date("2024-02-01"),
      lastActive: new Date("2024-03-20"),
      banned: true,
      approved: true
    },
    // Add more mock users as needed
  ];
  return (
    <div className="p-4 md:p-6">
      <DataTable columns={columns} data={users} searchKey="name" />
    </div>
  );
}
