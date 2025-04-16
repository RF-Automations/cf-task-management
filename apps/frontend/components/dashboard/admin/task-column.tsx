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
import { toast } from "sonner";
import { assignTask, updateTaskStatus } from "@/app/(dashboard)/admin/_actions";
import { useAuth } from "@clerk/nextjs";
import Status from "@/components/Status";

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
const StatusCell = ({ status, taskId }: { status: any; taskId: string }) => {
  const [newStatus, setNewStatus] = useState(status);
  const [changeStatus, setChangeStatus] = useState(false);
  const { getToken } = useAuth();

  if (!changeStatus) {
    return <Status status={status} onClick={() => setChangeStatus(true)} />;
  } else {
    return (
      <Select
        value={newStatus}
        onValueChange={async (value) => {
          const token = await getToken();
          if (!token) {
            toast.error("Status not udpated");
            return setNewStatus;
          }
          const res = await updateTaskStatus(taskId, value, token);

          console.log(res);
          if (res.data) {
            toast.success("Status updated succesfully");
          }

          if (res.error) {
            console.log(res.error, res.message);
            toast.error("Status not updated");
          }
          setNewStatus(value)
          return setNewStatus;
        }}
        onOpenChange={setChangeStatus}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="New Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="inprogress">In Progress</SelectItem>
          <SelectItem value="reassigned">Re Assign</SelectItem>
        </SelectContent>
      </Select>
    );
  }
};

const DeadlineCell = ({ date, taskId }: { date: any; taskId: string }) => {
  const [input, setInput] = useState(false);
  const [newDeadline, setNewDeadline] = useState(date);

  const { getToken } = useAuth();
  console.log(date)

  return (
    <div className="">
      {!input ? (
        <span
          className="p-2 rounded-md w-fit cursor-pointer"
          onClick={() => setInput(true)}
        >
          {date ? new Date(date)?.toLocaleDateString() : "Assign"}
        </span>
      ) : (
        <Input
          type="date"
          className="p-1 rounded-md w-fit"
          value={newDeadline}
          onChange={async (e) => {
            const token = await getToken();
            if (!token) {
              toast.error("Status not udpated");
              return setInput;
            }
            const res = await assignTask(taskId, new Date(e.target.value), token);
            
            console.log(res);
            if (res.data) {
              toast.success("Task assigned");
            }
            
            if (res.error) {
              console.log(res.error, res.message);
              toast.error("task not assigned");
            }
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
    accessorKey: "assignBy",
    header: "Assigned By",
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
      return <StatusCell status={status} taskId={row.original.id} />;
    },
  },
  {
    accessorKey: "dead_line",
    header: "Dead Line",
    cell: ({ row }) => {
      const date = row.getValue("dead_line") as Date;
      return <DeadlineCell date={date} taskId={row.original.id} />;
    },
  },
];
