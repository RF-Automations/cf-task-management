"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
} from "recharts";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";


const taskCompletionData = [
  { date: "2024-03-15", completed: 12, pending: 8, rejected: 2 },
  { date: "2024-03-16", completed: 15, pending: 6, rejected: 1 },
  { date: "2024-03-17", completed: 10, pending: 9, rejected: 3 },
  { date: "2024-03-18", completed: 18, pending: 5, rejected: 2 },
  { date: "2024-03-19", completed: 14, pending: 7, rejected: 1 },
  { date: "2024-03-20", completed: 16, pending: 6, rejected: 2 },
  { date: "2024-03-21", completed: 13, pending: 8, rejected: 1 },
];

const taskDifficultyData = [
  { name: "Easy", value: 30 },
  { name: "Medium", value: 45 },
  { name: "Hard", value: 25 },
];

const userPerformanceData = [
  { metric: "Task Completion", value: 85 },
  { metric: "On-time Delivery", value: 92 },
  { metric: "Quality Score", value: 88 },
  { metric: "Efficiency", value: 78 },
  { metric: "Complexity Handling", value: 82 },
];

const taskTimeDistribution = [
  { name: "< 1 day", tasks: 15 },
  { name: "1-2 days", tasks: 25 },
  { name: "2-3 days", tasks: 20 },
  { name: "3-5 days", tasks: 12 },
  { name: "5+ days", tasks: 8 },
];

const DIFFICULTY_COLORS = ["#10B981", "#F59E0B", "#EF4444"];

const filterUsers = [
  {
    value: "barun-tiwary",
    label: "Barun Tiwary",
  },
  {
    value: "barun-tiwary-1",
    label: "Barun Tiwary 1",
  },
  {
    value: "barun-tiwary-2",
    label: "Barun Tiwary 3",
  },
  {
    value: "barun-tiwary-3",
    label: "Barun Tiwary 3",
  },
  {
    value: "barun-tiwary-4",
    label: "Barun Tiwary 4",
  },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("week");
  const [value, setValue] = useState("");
  const [userComboOpen, setUserComboOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start md:items-center justify-between flex-wrap gap-4 flex-col md:flex-row">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <div className="flex gap-4 flex-col md:flex-row">
          <Popover open={userComboOpen} onOpenChange={setUserComboOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={userComboOpen}
                className="w-[200px] justify-between"
              >
                {value
                  ? filterUsers.find((user) => user.value === value)
                      ?.label
                  : "Select user..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput
                  placeholder="Search user..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>No user found.</CommandEmpty>
                  <CommandGroup>
                    {filterUsers.map((user) => (
                      <CommandItem
                        key={user.value}
                        value={user.value}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? "" : currentValue);
                          setUserComboOpen(false);
                        }}
                      >
                        {user.label}
                        <Check
                          className={cn(
                            "ml-auto",
                            value === user.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last 24 Hours</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Task Completion Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={taskCompletionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="hsl(var(--chart-1))"
                    name="Completed"
                  />
                  <Line
                    type="monotone"
                    dataKey="pending"
                    stroke="hsl(var(--chart-2))"
                    name="Pending"
                  />
                  <Line
                    type="monotone"
                    dataKey="rejected"
                    stroke="hsl(var(--chart-3))"
                    name="Rejected"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Distribution by Difficulty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskDifficultyData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {taskDifficultyData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          DIFFICULTY_COLORS[index % DIFFICULTY_COLORS.length]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  data={userPerformanceData}
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Performance"
                    dataKey="value"
                    stroke="hsl(var(--chart-1))"
                    fill="#F59E0B"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Completion Time Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taskTimeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <defs>
                    <linearGradient
                      id="taskGradients"
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
                  </defs>
                  <Bar
                    dataKey="tasks"
                    name="Number of Tasks"
                    fill="url(#taskGradients)"
                    radius={[4, 4, 0, 0]}
                    animationDuration={200}
                    animationEasing="ease-in-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
