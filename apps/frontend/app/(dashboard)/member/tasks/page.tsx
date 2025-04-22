"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth, useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { AssignTaskModal } from "@/components/dashboard/AssignTaskModel";
import axios from "axios";
import { BASE_BACKEND_URL } from "@/lib/constant";
import { usePathname, useRouter } from "next/navigation";

// Types
interface Task {
  id: string;
  title: string;
  description: string;
  difficulty_level: "easy" | "medium" | "moderate" | "hard";
  outcomes: string;
  status: "assigned" | "submitted" | "reassigned" | "completed" | "inprogress";
  prerequisites?: string;
  deadline?: string;
  createdAt?: Date;
}

const taskOptions: Task[] = [
  {
    id: "1",
    title: "Build a Responsive E-commerce Product Page",
    description:
      "Create a responsive product page for an e-commerce site with product images, description, pricing, and add to cart functionality.",
    difficulty_level: "medium",
    outcomes:
      "Responsive design, image carousel, product variations, add to cart feature",
    status: "inprogress",
  },
  {
    id: "2",
    title: "Create a Weather Dashboard",
    description:
      "Build a weather dashboard that fetches and displays current weather and forecasts for multiple cities.",
    difficulty_level: "medium",
    outcomes:
      "API integration, dynamic data display, search functionality, responsive design",
    status: "inprogress",
  },
  {
    id: "3",
    title: "Develop a Task Management App",
    description:
      "Create a full-featured task management application with task creation, categories, due dates, and completion tracking.",
    difficulty_level: "hard",
    outcomes:
      "CRUD operations, drag and drop interface, data persistence, user authentication",
    status: "inprogress",
  },
  {
    id: "4",
    title: "Build a Simple Blog Frontend",
    description:
      "Design and implement a simple blog frontend with article listings and detail pages.",
    difficulty_level: "easy",
    outcomes:
      "Responsive layout, article preview cards, article detail view, navigation",
    status: "inprogress",
  },
];

export default function TasksPage() {
  const { getToken } = useAuth();
  const { user } = useUser();

  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAssignTaskModalOpen, setIsAssignTaskModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter()
  const pathName = usePathname()

  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      const token = await getToken();
      const userDbId = user?.publicMetadata?.dbUserId;

      if (!token) {
        toast.warning("Login Again please.");
        return;
      }
      if (!userDbId) {
        toast.warning("User not found.");
        return;
      }

      if (!userDbId) return;

      try {
        setIsLoading(true);
        const response = await axios.get(
          `${BASE_BACKEND_URL}/tasks?userId=${userDbId}`
        );

        if (response.data.data) {
          const data: Task[] = response.data.data;
          setTasks(data || []);
        }

        if (response.data.error) {
          toast.error("Failed to get tasks.");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("Server side error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [user, getToken]);

  // Handle assign task button click
  const handleAssignTaskClick = () => {
    setIsAssignTaskModalOpen(true);
  };

  // Handle task assignment
  const handleTaskAssignment = async (task: any) => {
    setIsLoading(true);

    if (!task) {
      toast.warning("Select the task first.");
      return;
    }

    const token = await getToken();
    const userId = user?.publicMetadata?.dbUserId;

    if (!token) {
      toast.warning("Login Again please.");
      return;
    }
    if (!userId) {
      toast.warning("User not found.");
      return;
    }

    try {
      const assignedTask = await axios.post(
        `${BASE_BACKEND_URL}/tasks/assign`,
        {
          userId,
          task: {
            title: task.title,
            description: task.description,
            difficulty_level: task.difficulty_level,
            outcomes: task.outcomes,
            status: task.status,
            prerequisites: task.prerequisites,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = assignedTask.data?.data;

      console.log(data);

      if (data.error) {
        toast.error(data.message);
        return;
      }

      if (data) {
        toast.success("Wait for moderator to assign the task.");
        return;
      }
    } catch (error: any) {
      toast.error(error?.message);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-gray-500">Manage and track your assigned tasks.</p>
        </div>
        <Button onClick={handleAssignTaskClick}>Assign Task</Button>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-lg shadow overflow-x-auto w-full">
        {/* Table Header */}
        <div className="hidden md:grid md:grid-cols-12 md:gap-4 p-4 border-b bg-gray-50 font-medium">
          <div className="col-span-5">Task</div>
          <div className="col-span-2">Created At</div>
          <div className="col-span-2">Difficulty Level</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1">Action</div>
        </div>

        {/* Table Body */}
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No tasks found. Click &quot;Assign Task&quot; to get started.
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 p-4 border-b hover:bg-gray-50 items-center"
            >
              {/* Mobile view - stacked layout */}
              <div className="col-span-1 md:col-span-5 font-medium h-full w-full content-center cursor-pointer" onClick={() => router.push(`${pathName}/${task.id}`)}>
                {/* {task.title} */}
                {task.title}
              </div>

              <div className="grid grid-cols-2 md:hidden gap-2 text-sm text-gray-500">
                <div>Created At:</div>
                <div>{new Date(task.createdAt!).toLocaleDateString() + " - " + new Date(task.createdAt!).toLocaleTimeString() || "-"}</div>

                <div>Difficulty:</div>
                <div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      task.difficulty_level === "easy"
                        ? "bg-green-100 text-green-800"
                        : task.difficulty_level === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {task.difficulty_level.charAt(0).toUpperCase() +
                      task.difficulty_level.slice(1)}
                  </span>
                </div>

                <div>Status:</div>
                <div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      task.status === "submitted"
                        ? "bg-blue-100 text-blue-800"
                        : task.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : task.status === "inprogress"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Desktop view - columns */}
              <div className="hidden md:block md:col-span-2">
                {new Date(task.createdAt!).toLocaleDateString() + " - " + new Date(task.createdAt!).toLocaleTimeString() || "-"}
              </div>
              <div className="hidden md:block md:col-span-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    task.difficulty_level === "easy"
                      ? "bg-green-100 text-green-800"
                      : task.difficulty_level === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {task.difficulty_level.charAt(0).toUpperCase() +
                    task.difficulty_level.slice(1)}
                </span>
              </div>
              <div className="hidden md:block md:col-span-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    task.status === "submitted"
                      ? "bg-blue-100 text-blue-800"
                      : task.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : task.status === "inprogress"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </span>
              </div>
              <div className="col-span-1 md:col-span-1 mt-2 md:mt-0 flex justify-start md:justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`${pathName}/${task.id}`)}
                >
                  View Details
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
      <AssignTaskModal
        isOpen={isAssignTaskModalOpen}
        onClose={() => setIsAssignTaskModalOpen(false)}
        taskOptions={taskOptions}
        onSubmit={handleTaskAssignment}
      />
    </div>
  );
}
