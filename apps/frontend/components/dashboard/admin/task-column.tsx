"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

// Custom cell components with hooks
const StatusCell = ({ status }: { status: any }) => {
  const [newStatus, setNewStatus] = useState(status);
  const [changeStatus, setChangeStatus] = useState(false);

  if (!changeStatus) {
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
        onClick={() => setChangeStatus(true)}
      >
        {status}
      </Badge>
    );
  } else {
    return (
      <Select
        value={newStatus}
        onValueChange={setNewStatus}
        onOpenChange={setChangeStatus}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="New Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="inprogress">In Progress</SelectItem>
          <SelectItem value="reassign">Re Assign</SelectItem>
        </SelectContent>
      </Select>
    );
  }
};

const DeadlineCell = ({ date }: { date: any }) => {
  const [input, setInput] = useState(false);
  const [newDeadline, setNewDeadline] = useState(date);

  return (
    <div className="">
      {!input ? (
        <span
          className="p-2 rounded-md w-fit cursor-pointer"
          onClick={() => setInput(true)}
        >
          {date.toLocaleDateString()}
        </span>
      ) : (
        <Input
          type="date"
          className="p-1 rounded-md w-fit"
          value={newDeadline}
          onChange={(e) => {
            setNewDeadline(e.target.value);
            setInput(false);
          }}
        />
      )}
    </div>
  );
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
      return <StatusCell status={status} />;
    },
  },
  {
    accessorKey: "dead_line",
    header: "Dead Line",
    cell: ({ row }) => {
      const date = row.getValue("dead_line") as Date;
      return <DeadlineCell date={date} />;
    },
  },
];
