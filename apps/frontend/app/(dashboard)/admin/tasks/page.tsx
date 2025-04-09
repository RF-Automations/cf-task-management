"use client";

import { useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { task_columns } from "@/components/dashboard/admin/task-column";
import { CreateTaskDialog } from "@/components/dashboard/admin/create-task-dialog";

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

// Mock data - replace with actual API call
const tasks: Task[] = [
  {
    id: "1",
    title: "Implement login page",
    description: "Create a responsive login page with form validation",
    assignedTo: "John Doe",
    difficulty_level: "medium",
    status: "inprogress",
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-15"),
    dead_line: new Date("2024-03-30"),
  },
  // Add more mock tasks as needed
];

export default function TasksPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Task
        </Button>
      </div>
      <div className="mt-8">
        <DataTable columns={task_columns} data={tasks} searchKey="title" />
      </div>
      <CreateTaskDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
