"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

interface ActiveUser {
  id: string;
  name: string;
  tasksCompleted: number;
  tasksAssigned: number;
  completionRate: string;
  lastActive: Date;
}

export const activeUserColumns: ColumnDef<ActiveUser>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "tasksCompleted",
    header: "Completed",
  },
  {
    accessorKey: "tasksAssigned",
    header: "Assigned",
  },
  {
    accessorKey: "completionRate",
    header: "Completion Rate",
    cell: ({ row }) => {
      const rate = row.getValue("completionRate") as string;
      const percentage = parseInt(rate);
      return (
        <Badge
          className={
            percentage >= 80
              ? "bg-green-500"
              : percentage >= 60
              ? "bg-yellow-500"
              : "bg-red-500"
          }
        >
          {rate}
        </Badge>
      );
    },
  },
  {
    accessorKey: "lastActive",
    header: "Last Active",
    cell: ({ row }) => {
      const date = row.getValue("lastActive") as Date;
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
];