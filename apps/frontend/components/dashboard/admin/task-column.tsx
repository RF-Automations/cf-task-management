"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { approveTask, assignTask } from "@/app/(dashboard)/admin/_actions";
import { useAuth } from "@clerk/nextjs";
import Status from "@/components/Status";
import { usePathname, useRouter } from "next/navigation";

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

const DeadlineCell = ({ date, taskId }: { date: any; taskId: string }) => {
  const [input, setInput] = useState(false);
  const [newDeadline, setNewDeadline] = useState(date);

  const { getToken } = useAuth();
  console.log(date);

  return (
    <div className="">
      {!input ? (
        <span
          className="p-2 rounded-md w-fit cursor-pointer"
          onClick={() => {
            if (date) return;
            setInput(true);
          }}
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
            const approvRes = await approveTask(taskId, token);
            const res = await assignTask(
              taskId,
              new Date(e.target.value),
              token
            );

            console.log(res);
            if (res.data && approvRes.data) {
              toast.success("Task approved & assigned");
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

const TitleCell = ({ title, id }: { title: string, id: string }) => {
  const router = useRouter();
  const path = usePathname();
  console.log(path);
  return (
    <span 
    className="h-full w-full cursor-pointer" 
    onClick={() => router.push(`${path}/${id}`)}>
      {title}
    </span>
  );
};

export const task_columns: ColumnDef<Task>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return <TitleCell title={title} id={row.original.id} />;
    },
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
      const status = row.getValue("status") as any;
      return <Status status={status} />;
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
