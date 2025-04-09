"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  CheckCircle,
  RefreshCcw,
} from "lucide-react";

export type Task = {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  difficulty_level: "easy" | "medium" | "moderate" | "hard";
  status: "assigned" | "submitted" | "reassigned" | "completed" | "inprogress";
  createdAt: Date;
  updatedAt: Date;
  dead_line: Date;
};

export const task_columns: ColumnDef<Task>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "assignedTo",
    header: "Assigned To",
  },
  {
    accessorKey: "difficulty_level",
    header: "Difficulty Level",
    cell: ({ row }) => {
      const difficulty_level = row.getValue("difficulty_level") as string;
      return (
        <Badge
          className={
            difficulty_level === "easy"
              ? "bg-green-500"
              : difficulty_level === "medium"
                ? "bg-yellow-500"
                : "bg-red-500"
          }
        >
          {difficulty_level}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          className={
            status === "completed"
              ? "bg-green-500"
              : status === "rejected"
                ? "bg-red-500"
                : status === "in-progress"
                  ? "bg-blue-500"
                  : "bg-yellow-500"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "dead_line",
    header: "Due Date",
    cell: ({ row }) => {
      const date = row.getValue("dead_line") as Date;
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const task = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => console.log("Complete", task.id)}
              className="text-green-600"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("In Progress", task.id)}
              className="text-yellow-600"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Re Assign
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
