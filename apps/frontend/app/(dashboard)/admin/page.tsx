"use client";

import { activeUserColumns } from "@/components/dashboard/admin/active-user-column";
import { DataTable } from "@/components/data-table/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BASE_BACKEND_URL } from "@/lib/constant";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { Users } from "lucide-react";
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

const weeklyTaskCompeletion = [
  { name: "Mon", compeletedTask: 0, assignedTask: 0 },
  { name: "Tue", compeletedTask: 0, assignedTask: 0 },
  { name: "Wed", compeletedTask: 0, assignedTask: 0 },
  { name: "Thu", compeletedTask: 0, assignedTask: 0 },
  { name: "Fri", compeletedTask: 0, assignedTask: 0 },
  { name: "Sat", compeletedTask: 0, assignedTask: 0 },
  { name: "Sun", compeletedTask: 0, assignedTask: 0 },
];

const usersActivity = [
  {
    label: "Total Users",
    value: 1234,
    description: "+20.1% from last month",
  },
  {
    label: "Active Users",
    value: 20,
    description: "+10.5% from last month",
  },
  {
    label: "Banned Users",
    value: 0,
    description: "+0% from last month",
  },
  {
    label: "Total Tasks",
    value: 111,
    description: "+18% from last month",
  },
];

export default function AdminDashboard() {
  const [activeUsers, setActiveUsers] = useState([]);

  const { getToken } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();
      console.log("overview admin:", token);
      const users: any = await axios.get(
        `${BASE_BACKEND_URL + "/admin/activeUsers"}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(users);

      const filterUsers = users.data.data.filter(
        (user: any) => user.role === "member" || user.role === "moderator"
      );

      console.log(filterUsers)
      const newActiveUsers: any = [];

      filterUsers.map((user: any) => {
        const newUser = {
          id: user?.id,
          name: user?.firstName ? user.firstName + " " + user.lastName : " ",
          tasksCompleted: 0,
          tasksAssigned: 0,
          lastActive: user?.lastActiveAt,
          completionRate: "0%",
        };

        filterUsers.task?.map((task: any) => {
          if (task?.status === "completed") {
            newUser.tasksCompleted = newUser.tasksCompleted++;
          } else if (task?.status === "assigned") {
            newUser.tasksCompleted = newUser.tasksAssigned++;
          }
        });

        newUser.completionRate = `${newUser.tasksAssigned === 0 ? 0 : Number(newUser.tasksCompleted / newUser.tasksAssigned) * 100}%`;
        newActiveUsers.push(newUser);
      });

      console.log(newActiveUsers);
      setActiveUsers(newActiveUsers);
    };
    fetchData();
  }, [getToken]);

  return (
    <div className="p-4 md:p-6 flex flex-col gap-4 md:gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {usersActivity.length > 0 &&
          usersActivity.map((activity, idx) => (
            <Card key={idx}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {activity.label}
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activity.value}</div>
                <p className="text-xs text-muted-foreground">
                  {activity.description}
                </p>
              </CardContent>
            </Card>
          ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Task Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
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
                      <stop
                        offset="95%"
                        stopColor="#6366f1"
                        stopOpacity={0.3}
                      />
                    </linearGradient>
                    <linearGradient
                      id="completedGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#10b981"
                        stopOpacity={0.3}
                      />
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={activeUserColumns}
              data={activeUsers}
              searchKey="name"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
