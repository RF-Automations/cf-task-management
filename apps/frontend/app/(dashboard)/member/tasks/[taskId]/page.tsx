"use client";

import { getTask } from "@/actions/tasks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useAuth, useUser } from "@clerk/nextjs";
import {
  CalendarIcon,
  CheckCircleIcon,
  GitBranchIcon,
  LinkIcon,
  UserIcon,
  ClockIcon,
  BookIcon,
  ExternalLinkIcon,
  Plus,
  Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import { BASE_BACKEND_URL } from "@/lib/constant";
import { toast } from "sonner";
import Status from "@/components/Status";
import { Input } from "@/components/ui/input";

interface Submission {
  id: string;
  userId: string;
  taskId: string;
  github: string;
  source_link: string[];
  feedback: string | null;
  status: any;
  reAssignedUserId?: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignedBy?: string;
  difficulty_level: "easy" | "medium" | "moderate" | "hard";
  outcomes: string;
  status: "assigned" | "submitted" | "reassigned" | "completed" | "inprogress";
  prerequisites?: string;
  dead_line?: string;
  createdAt?: Date;
  updatedAt?: Date;

  user?: { firstName: string };
  submissions?: Submission[];
  creator?: { firstName: string };
}

const submitTaskFormSchema = z.object({
  githubLink: z.string().url("Please enter a valid GitHub URL"),
  sourceLinks: z.array(
    z.string().url("Please enter a valid URL").or(z.string().length(0))
  ),
});

export default function SpecificTaskPage({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const [task, setTask] = useState<Task>();
  const [sourceLinks, setSourceLinks] = useState<string[]>([""]);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [submitTaskDialogOpen, setSubmitTaskDialogOpen] = useState(false);
  const { getToken, userId } = useAuth();
  const { user } = useUser();
  const { taskId } = React.use(params);

  // Initialize Submit form
  const submitTaskForm = useForm<z.infer<typeof submitTaskFormSchema>>({
    resolver: zodResolver(submitTaskFormSchema),
    defaultValues: {
      githubLink: "",
      sourceLinks: [""],
    },
  });

  console.log(selectedSubmission);

  const addSourceLink = () => {
    setSourceLinks([...sourceLinks, ""]);
    submitTaskForm.setValue("sourceLinks", [
      ...submitTaskForm.getValues("sourceLinks"),
      "",
    ]);
  };

  const removeSourceLink = (index: number) => {
    const newLinks = [...sourceLinks];
    newLinks.splice(index, 1);
    setSourceLinks(newLinks);

    const formLinks = [...submitTaskForm.getValues("sourceLinks")];
    formLinks.splice(index, 1);
    submitTaskForm.setValue("sourceLinks", formLinks);
  };

  const handleSubmitTask = async (
    values: z.infer<typeof submitTaskFormSchema>
  ) => {
    // Filter out empty source links
    const pmt = prompt(
      "Are you confirm you want to submit you task. You won't be able to edit you submission. yes for continue no for not."
    );
    if (pmt?.toLowerCase() === "no") {
      return;
    } else if (pmt?.toLowerCase() === "yes") {
      const token = await getToken();
      const filteredSourceLinks = values.sourceLinks.filter(
        (link: string) => link.trim() !== ""
      );
      console.log(task);

      if (!task) {
        toast.error("task not found");
        return;
      }

      console.log({ ...values, taskId }, BASE_BACKEND_URL);

      if (!userId || !user?.publicMetadata?.dbUserId) {
        toast.error("User Not loggedin");
        return;
      }

      if (
        task.submissions &&
        task?.submissions[task.submissions?.length - 1].status === "submitted"
      ) {
        toast.warning("Wait for the last submission review");
        setSubmitTaskDialogOpen(false);
        return;
      }

      try {
        const response = await axios.post(
          `${BASE_BACKEND_URL}/tasks/submit`,
          {
            userId: user?.publicMetadata?.dbUserId,
            taskId: taskId,
            githubLink: values.githubLink,
            sourceLinks: filteredSourceLinks,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(response.data);
        if (response.data.error) {
          toast.warning(response.data.message);
          setSubmitTaskDialogOpen(false);

          return;
        }

        toast.success("Task submitted Successfully");
      } catch (error) {
        console.error("Error submitting task:", error);
        toast.error("Failed to submit the task");
      } finally {
        setSubmitTaskDialogOpen(false);
        submitTaskForm.reset();
      }
    }
  };

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) {
        return;
      }
      const fetchTask = await getTask(taskId, token);
      if (fetchTask?.data) {
        setTask(fetchTask?.data);
      }
    })();
  }, [taskId, getToken]);

  // Status badge styling
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      assigned: {
        color: "bg-blue-100 text-blue-800",
        icon: <ClockIcon className="h-3 w-3 mr-1" />,
      },
      inprogress: {
        color: "bg-yellow-100 text-yellow-800",
        icon: <ClockIcon className="h-3 w-3 mr-1" />,
      },
      submitted: {
        color: "bg-purple-100 text-purple-800",
        icon: <CheckCircleIcon className="h-3 w-3 mr-1" />,
      },
      reassigned: {
        color: "bg-orange-100 text-orange-800",
        icon: <UserIcon className="h-3 w-3 mr-1" />,
      },
      completed: {
        color: "bg-green-100 text-green-800",
        icon: <CheckCircleIcon className="h-3 w-3 mr-1" />,
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      color: "bg-gray-100 text-gray-800",
      icon: null,
    };
    return (
      <Badge className={`${config.color} flex items-center px-2 py-1`}>
        {config.icon}
        <span className="capitalize">{status}</span>
      </Badge>
    );
  };

  // Difficulty badge styling
  const getDifficultyBadge = (level: string) => {
    const levelConfig = {
      easy: "bg-green-100 text-green-800",
      medium: "bg-blue-100 text-blue-800",
      moderate: "bg-yellow-100 text-yellow-800",
      hard: "bg-red-100 text-red-800",
    };

    return (
      <Badge
        className={`${levelConfig[level as keyof typeof levelConfig]} px-2 py-1`}
      >
        <span className="capitalize">{level}</span>
      </Badge>
    );
  };

  return (
    <div className="space-y-6 p-6 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">{task?.title}</h2>
          <div className="flex items-center gap-2 mt-2">
            {task?.status && getStatusBadge(task.status)}
            {task?.difficulty_level &&
              getDifficultyBadge(task.difficulty_level)}
            {task?.dead_line && (
              <div className="flex items-center text-gray-500 text-sm">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>Due {new Date(task.dead_line).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Dialog
            open={submitTaskDialogOpen}
            onOpenChange={setSubmitTaskDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border-orange-500 text-orange-500 hover:bg-orange-50"
                disabled={task?.status === "completed" ? true : false}
              >
                Submit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Submit Task</DialogTitle>
                <DialogDescription>
                  Add the github and source link (any extra resource/live link
                  in case of deployed website).
                </DialogDescription>
              </DialogHeader>

              <Form {...submitTaskForm}>
                <form
                  onSubmit={submitTaskForm.handleSubmit(handleSubmitTask)}
                  className="space-y-4"
                >
                  <FormField
                    control={submitTaskForm.control}
                    name="githubLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          GitHub Link <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://github.com/yourusername/repo"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <FormLabel>Source Links (Optional)</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addSourceLink}
                        className="flex items-center text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add Link
                      </Button>
                    </div>

                    {sourceLinks.map((_, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <FormField
                          control={submitTaskForm.control}
                          name={`sourceLinks.${index}`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  placeholder="https://example.com/resource"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {sourceLinks.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSourceLink(index)}
                            className="h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSubmitTaskDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Submit Task</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <BookIcon className="h-5 w-5 mr-2" />
              Task Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <Label className="text-sm text-gray-500">Description</Label>
              <p className="mt-1 whitespace-pre-line">{task?.description}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <Label className="text-sm text-gray-500">Expected Outcome</Label>
              <p className="mt-1 whitespace-pre-line">{task?.outcomes}</p>
            </div>

            {task?.prerequisites && (
              <div className="bg-gray-50 p-4 rounded-md">
                <Label className="text-sm text-gray-500">Prerequisites</Label>
                <p className="mt-1 whitespace-pre-line">
                  {task?.prerequisites}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <UserIcon className="h-5 w-5 mr-2" />
              Assignment Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-1">
              <Label className="text-sm text-gray-500">Assigned By</Label>
              <p className="font-medium flex items-center">
                <UserIcon className="h-4 w-4 mr-1 text-green-500" />
                {task?.creator?.firstName || "N/A"}
              </p>
            </div>

            <div className="flex flex-col space-y-1">
              <Label className="text-sm text-gray-500">Created On</Label>
              <p className="font-medium flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
                {task?.createdAt
                  ? new Date(task.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>

            <div className="flex flex-col space-y-1">
              <Label className="text-sm text-gray-500">Deadline</Label>
              <p
                className={`font-medium flex items-center ${task?.dead_line && new Date(task.dead_line) < new Date() ? "text-red-500" : ""}`}
              >
                <ClockIcon className="h-4 w-4 mr-1" />
                {task?.dead_line
                  ? new Date(task.dead_line).toLocaleString()
                  : "No deadline"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <CheckCircleIcon className="h-5 w-5 mr-2" />
          Submissions
        </h3>

        {task?.submissions && task?.submissions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {task?.submissions?.map((submission) => (
              <Card
                key={submission.id}
                className="hover:shadow-md transition-shadow h-full"
              >
                <CardContent className="space-y-3 pt-4 h-full flex flex-col justify-between">
                  <div className="flex flex-col space-y-2 pb-2">
                    {submission.github && (
                      <div className="flex items-start space-x-2">
                        <GitBranchIcon className="h-4 w-4 mt-1 text-gray-500" />
                        <a
                          href={submission.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline text-blue-600 hover:text-blue-800 text-sm"
                        >
                          {submission.github.substring(0, 45)}
                          {submission.github.length > 45 && "..."}
                        </a>
                      </div>
                    )}
                    {submission.source_link &&
                      submission.source_link.length > 0 && (
                        <div className="flex items-start space-x-2">
                          <LinkIcon className="h-4 w-4 mt-1 text-gray-500" />
                          <a
                            href={submission.source_link[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-blue-600 hover:text-blue-800 text-sm"
                          >
                            {submission.source_link[0].substring(0, 45)}
                            {submission.source_link[0].length > 45 && "..."}
                          </a>
                        </div>
                      )}
                    <div className="">
                      <Status status={submission.status} />
                    </div>
                  </div>

                  {submission.feedback && (
                    <div className="bg-gray-50 p-2 rounded text-sm">
                      <p className="font-medium text-gray-700 mb-1">
                        Feedback:
                      </p>
                      <p className="text-gray-600">
                        {submission.feedback.length > 100
                          ? `${submission.feedback.substring(0, 100)}...`
                          : submission.feedback}
                      </p>
                    </div>
                  )}

                  <Dialog
                    onOpenChange={(open) => {
                      if (open) setSelectedSubmission(submission);
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2"
                      >
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Submission Details</DialogTitle>
                        <DialogDescription>
                          Review the submission details and feedback
                        </DialogDescription>
                      </DialogHeader>
                      <ScrollArea className="max-h-96 mt-4">
                        <div className="space-y-6 p-2">
                          {/* Github Repository Link */}
                          {selectedSubmission?.github && (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                GitHub Repository
                              </Label>
                              <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                                <div className="flex items-center space-x-2 overflow-hidden">
                                  <GitBranchIcon className="h-5 w-5 text-gray-600 flex-shrink-0" />
                                  <span className="text-sm truncate overflow-hidden">
                                    {selectedSubmission.github}
                                  </span>
                                </div>
                                <a
                                  href={selectedSubmission.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-shrink-0"
                                >
                                  <Button variant="ghost" size="sm">
                                    <ExternalLinkIcon className="h-4 w-4" />
                                  </Button>
                                </a>
                              </div>
                            </div>
                          )}

                          {/* Source Links */}
                          {selectedSubmission?.source_link &&
                            selectedSubmission.source_link.length > 0 && (
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">
                                  Additional Resources
                                </Label>
                                <div className="space-y-2">
                                  {selectedSubmission.source_link.map(
                                    (link, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center justify-between bg-gray-50 p-3 rounded"
                                      >
                                        <div className="flex items-center space-x-2 overflow-hidden">
                                          <LinkIcon className="h-5 w-5 text-gray-600 flex-shrink-0" />
                                          <span className="text-sm truncate overflow-hidden">
                                            {link}
                                          </span>
                                        </div>
                                        <a
                                          href={link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex-shrink-0"
                                        >
                                          <Button variant="ghost" size="sm">
                                            <ExternalLinkIcon className="h-4 w-4" />
                                          </Button>
                                        </a>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                          {/* Feedback */}
                          {selectedSubmission?.feedback && (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Feedback
                              </Label>
                              <div className="bg-gray-50 p-4 rounded border border-gray-200">
                                <p className="text-sm whitespace-pre-line">
                                  {selectedSubmission.feedback}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Submission ID for reference */}
                          <div className="pt-4 border-t border-gray-200">
                            <p className="text-xs text-gray-500">
                              Submission ID: {selectedSubmission?.id}
                            </p>
                          </div>
                        </div>
                      </ScrollArea>
                      <div className="flex justify-end space-x-2 mt-4">
                        <DialogClose asChild>
                          <Button variant="outline">Close</Button>
                        </DialogClose>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-gray-50">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-gray-400 mb-2">
                <ClockIcon className="h-12 w-12" />
              </div>
              <h2 className="text-xl font-medium text-gray-600">
                No submissions yet
              </h2>
              <p className="text-gray-500 mt-1">
                Submissions will appear here when available
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
