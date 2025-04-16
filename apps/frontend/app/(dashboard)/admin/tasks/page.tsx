"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { task_columns } from "@/components/dashboard/admin/task-column";
import { CreateTaskDialog } from "@/components/dashboard/admin/create-task-dialog";
import axios from "axios";
import { BASE_BACKEND_URL } from "@/lib/constant";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { getUsers } from "../_actions";

export type Task = {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignBy: string;
  difficulty_level: "easy" | "medium" | "moderate" | "hard";
  status: "assigned" | "submitted" | "reassigned" | "completed" | "inprogress";
  createdAt: Date;
  updatedAt: Date;
  dead_line: Date;
};

export default function TasksPage() {
  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState([])

  const { getToken } = useAuth();

  const fetchTasks = async () => {
    const token = await getToken();
    console.log("task admin: ", token);
    const fetchedTasks: any = await axios.get(
      `${BASE_BACKEND_URL}/admin/tasks`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const finalTasks: any = [];
    console.log(fetchedTasks);
    fetchedTasks.data?.data?.map((task: any) => {
      const newTask = {
        id: task.id,
        title: task.title,
        description: task.description,
        assignedTo: task.user.firstName + " " + task.user.lastName,
        assignBy: task.creator.firstName + " " + task.creator.lastName,
        difficulty_level: task.difficulty_level,
        status: task.status,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        dead_line: task.dead_line,
      };
      finalTasks.push(newTask);
    });

    if (finalTasks.length === 0) {
      toast.warning("Tasks not found");
    }

    setTasks(finalTasks);
  };

  console.log(tasks);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) {
        toast.error("Unable to fetch users");
        return;
      }
      const users: any = await getUsers(token);
      const finalUsers: any = [];

      console.log("user useEffect tasks admin: ", users)

      users.data.map((user: any) => {
        const newUser = {
          value: user?.id,
          label: user?.firstName + " " + user?.lastName,
        };
        finalUsers.push(newUser);
      });
      console.log(finalUsers);
      setUsers(finalUsers);
    })();
  }, []);

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
      <CreateTaskDialog open={open} onOpenChange={setOpen} users={users} />
    </div>
  );
}
