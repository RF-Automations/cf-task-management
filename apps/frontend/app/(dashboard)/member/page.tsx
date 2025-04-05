"use client";

import Status from "@/components/Status";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BASE_BACKEND_URL } from "@/lib/constant";
import { Task, TaskCount } from "@/types/common";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DashboardPage() {
  const { user } = useUser();
  const [username, setUsername] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [recentTask, setRecentTasks] = useState<Task[]>([]);
  const [taskCounts, setTaskCounts] = useState<TaskCount>({
    inProgress: 0,
    completed: 0,
    submitted: 0,
    reassigned: 0,
    assigned: 0,
  });

  const { getToken } = useAuth();

  console.log("recent task", recentTask);
  console.log("tasks: ", tasks);
  // Fetch tasks on component mount

  useEffect(() => {
    const fetchTasks = async () => {
      const token = getToken();
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
        const response = await axios.get(
          `${BASE_BACKEND_URL}/tasks?userId=${userDbId}`
        );

        const tasks: Task = response.data.data;

        if (tasks) {
          const data: Task[] = response.data.data;
          setTasks(data || []);
          console.log(
            "inside useeffect recent task",
            data.slice(0, data.length > 10 ? 10 : data.length)
          );
          setRecentTasks(data.slice(0, data.length > 10 ? 10 : data.length));

          // Calculate counts
          const counts = {
            inProgress: 0,
            completed: 0,
            submitted: 0,
            reassigned: 0,
            assigned: 0,
          };

          data.map((task) => {
            if (task.status === "inprogress") counts.inProgress++;
            else if (task.status === "completed") counts.completed++;
            else if (task.status === "submitted") counts.submitted++;
            else if (task.status === "reassigned") counts.reassigned++;
            else if (task.status === "assigned") counts.assigned++;
          });
          setTaskCounts(counts);
          setUsername(
            user?.fullName ||
              user?.firstName + " " + user?.lastName ||
              user?.username ||
              " "
          );
        }

        if (response.data.error) {
          toast.error("Failed to get tasks.");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("Server side error");
      }
    };

    fetchTasks();
  }, [getToken, user]);

  return (
    <div className="space-y-8 p-4 md:p-6">
      <div>
        <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">
          <span className="text-xl lg:text-2xl">Welcome back, </span> <br className="block md:hidden" />{" "}
          <span className="text-orange-400">
            {username}
          </span>
        </h2>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your tasks and progress.
        </p>
      </div>

      {/* Task Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <svg
              className="h-6 w-6 text-green-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <p className="text-gray-500">Completed</p>
            <p className="text-2xl font-bold">{taskCounts.completed}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-yellow-100 p-3 mr-4">
            <svg
              className="h-6 w-6 text-yellow-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-gray-500">Submitted</p>
            <p className="text-2xl font-bold">{taskCounts.submitted}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-red-100 p-3 mr-4">
            <svg
              className="h-6 w-6 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <div>
            <p className="text-gray-500">Assigned</p>
            <p className="text-2xl font-bold">{taskCounts.assigned}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-red-100 p-3 mr-4">
            <svg
              className="h-6 w-6 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <div>
            <p className="text-gray-500">Re-Assigned</p>
            <p className="text-2xl font-bold">{taskCounts.reassigned}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex items-center lg:col-start-1 lg:col-end-3">
          <div className="rounded-full bg-red-100 p-3 mr-4">
            <svg
              className="h-6 w-6 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <div>
            <p className="text-gray-500">In Progress</p>
            <p className="text-2xl font-bold">{taskCounts.inProgress}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Recent Tasks</h3>
          <div className="space-y-4">
            {recentTask.length > 0 &&
              recentTask.map((task, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold">{task.title}</span>
                    <Status status={task.status as any} />
                  </div>
                </div>
              ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Overall Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">
                  {Number((taskCounts.completed / tasks.length) * 100).toFixed(
                    2
                  )}
                  %
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tasks Completed</p>
                <p className="text-2xl font-bold">
                  {taskCounts.completed + "/" + tasks.length}
                </p>
              </div>
            </div>
            <Progress
              value={Number((taskCounts.completed / tasks.length) * 100)}
              className="h-2"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
