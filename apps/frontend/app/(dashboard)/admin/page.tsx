"use client";

import { activeUserColumns } from "@/components/dashboard/admin/active-user-column";
import { DataTable } from "@/components/data-table/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, UserCheck, Users, UserX } from "lucide-react";
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

const activeUsers = [
  {
    id: "1",
    name: "John Doe",
    tasksCompleted: 15,
    tasksAssigned: 20,
    completionRate: "75%",
    lastActive: new Date("2024-03-20"),
  },
  {
    id: "2",
    name: "Jane Smith",
    tasksCompleted: 12,
    tasksAssigned: 15,
    completionRate: "80%",
    lastActive: new Date("2024-03-21"),
  },
  {
    id: "3",
    name: "Mike Johnson",
    tasksCompleted: 18,
    tasksAssigned: 22,
    completionRate: "82%",
    lastActive: new Date("2024-03-19"),
  },
];

const weeklyTaskCompeletion = [
  { name: "Mon", compeletedTask: 0, assignedTask: 0 },
  { name: "Tue", compeletedTask: 0, assignedTask: 0 },
  { name: "Wed", compeletedTask: 0, assignedTask: 0 },
  { name: "Thu", compeletedTask: 0, assignedTask: 0 },
  { name: "Fri", compeletedTask: 0, assignedTask: 0 },
  { name: "Sat", compeletedTask: 0, assignedTask: 0 },
  { name: "Sun", compeletedTask: 0, assignedTask: 0 },
];
export default function AdminDashboard() {
  return (
    <div className="p-4 md:p-6 flex flex-col gap-4 md:gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,000</div>
            <p className="text-xs text-muted-foreground">
              +10.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Banned Users</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              +12.3% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">
              +18.7% from last month
            </p>
          </CardContent>
        </Card>
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
