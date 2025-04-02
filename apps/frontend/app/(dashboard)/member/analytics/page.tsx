"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BASE_BACKEND_URL } from "@/lib/constant";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Legend,
  Bar,
} from "recharts";
import { toast } from "sonner";
import { calculateWeeklyTaskCompletion } from "@/lib/analytics";

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
  updatedAt?: Date;
}

export default function AnalyticsPage() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskDistribution, setTaskDistribution] = useState({
    easy: 0,
    medium: 0,
    moderate: 0,
    hard: 0,
  });
  const [weeklyTaskCompeletion, setWeeklyTaskCompeletion] = useState([
    { name: "Mon", compeletedTask: 0, assignedTask: 0 },
    { name: "Tue", compeletedTask: 0, assignedTask: 0 },
    { name: "Wed", compeletedTask: 0, assignedTask: 0 },
    { name: "Thu", compeletedTask: 0, assignedTask: 0 },
    { name: "Fri", compeletedTask: 0, assignedTask: 0 },
    { name: "Sat", compeletedTask: 0, assignedTask: 0 },
    { name: "Sun", compeletedTask: 0, assignedTask: 0 },
  ]);

  const [taskCompeletionRate, setTaskCompeletionRate] = useState({
    thisWeek: 0,
    lastWeek: 0,
  });

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

        if (response.data.error) {
          toast.error("Failed to get tasks.");
        }

        if (response.data.data) {
          const data: Task[] = response.data.data;
          setTasks(data || []);
          data.map((task) => {
            setTaskDistribution((prev) => ({
              ...prev,
              [task.difficulty_level]:
                taskDistribution[task.difficulty_level] + 1,
            }));
          });

          const today = new Date();
          const todayDate = today.toLocaleDateString();

          const nextWeek = new Date();
          nextWeek.setDate(today.getDate() - 7);
          const nextWeekDate = nextWeek.toLocaleDateString();
          const thisWeekTask = data.filter(
            (task) =>
              new Date(task.createdAt!).toLocaleDateString() <= todayDate &&
              new Date(task.createdAt!).toLocaleDateString() > nextWeekDate
          );
          let thisWeekCompeletedTask = 0;
          thisWeekTask.map((task) => {
            if (task.status === "completed") {
              thisWeekCompeletedTask++;
            }
          });
          const thisWeekCompletetionRate = Number(
            (thisWeekCompeletedTask / thisWeekTask.length) * 100
          )
            ? Number((thisWeekCompeletedTask / thisWeekTask.length) * 100)
            : 0;
          setWeeklyTaskCompeletion(calculateWeeklyTaskCompletion(thisWeekTask));

          const lastWeek = new Date();
          lastWeek.setDate(nextWeek.getDate() - 7);
          const lastWeekDate = lastWeek.toLocaleDateString();

          const lastWeekTask = data.filter(
            (task) =>
              new Date(task.createdAt!).toLocaleDateString() <= nextWeekDate &&
              new Date(task.createdAt!).toLocaleDateString() > lastWeekDate
          );

          let lastWeeCompeletedTask = 0;
          lastWeekTask.map((task) => {
            if (task.status === "completed") {
              lastWeeCompeletedTask++;
            }
          });
          const lastWeekCompletetionRate = Number(
            (lastWeeCompeletedTask / lastWeekTask.length) * 100
          )
            ? Number((lastWeeCompeletedTask / lastWeekTask.length) * 100)
            : 0;
          console.log(
            (lastWeeCompeletedTask / lastWeekTask.length) * 100,
            lastWeekCompletetionRate,
            thisWeekCompeletedTask
          );

          setTaskCompeletionRate((prev) => ({
            ...prev,
            lastWeek: lastWeekCompletetionRate,
            thisWeek: thisWeekCompletetionRate,
          }));
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("Server side error");
      }
    };

    fetchTasks();
  }, [user, getToken]);


  return (
    <div className="space-y-8 p-4 md:p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">
          View your task performance and statistics.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Task Completion Rate</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold">
                  {taskCompeletionRate.thisWeek.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Week</p>
                <p className="text-2xl font-bold">
                  {taskCompeletionRate.lastWeek.toFixed(2)}%
                </p>
              </div>
            </div>
            <Progress
              value={
                taskCompeletionRate.thisWeek - taskCompeletionRate.lastWeek
              }
              className="h-2"
            />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Task Distribution</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Easy</span>
                <span className="text-muted-foreground">
                  {Number(
                    (taskDistribution.easy / tasks.length) * 100
                  ).toFixed(2)}
                  %
                </span>
              </div>
              <Progress
                value={Number(
                  ((taskDistribution.easy / tasks.length) * 100).toFixed(2)
                )}
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Medium</span>
                <span className="text-muted-foreground">
                  {Number(
                    (taskDistribution.medium / tasks.length) * 100
                  ).toFixed(2)}
                  %
                </span>
              </div>
              <Progress
                value={Number(
                  ((taskDistribution.medium / tasks.length) * 100).toFixed(
                    2
                  )
                )}
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Moderate</span>
                <span className="text-muted-foreground">
                  {Number(
                    (taskDistribution.moderate / tasks.length) * 100
                  ).toFixed(2)}
                  %
                </span>
              </div>
              <Progress
                value={Number(
                  (
                    (taskDistribution.moderate / tasks.length) *
                    100
                  ).toFixed(2)
                )}
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Hard</span>
                <span className="text-muted-foreground">
                  {Number(
                    (taskDistribution.hard / tasks.length) * 100
                  ).toFixed(2)}
                  %
                </span>
              </div>
              <Progress
                value={Number((taskDistribution.hard / tasks.length) * 100)}
                className="h-2"
              />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Weekly Task Completion</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={weeklyTaskCompeletion}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value) => [
                  String(Math.floor(Number(value))),
                  "",
                ]}
              />
              <Legend />
              <defs>
                <linearGradient
                  id="assignedGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.3} />
                </linearGradient>
                <linearGradient
                  id="completedGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <Bar
                dataKey="assignedTask"
                name="Assigned Tasks"
                fill="url(#assignedGradient)"
                radius={[4, 4, 0, 0]}
                animationDuration={200}
                animationEasing="ease-in-out"
              />
              <Bar
                dataKey="compeletedTask"
                name="Completed Tasks"
                fill="url(#completedGradient)"
                radius={[4, 4, 0, 0]}
                animationDuration={200}
                animationEasing="ease-in-out"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
