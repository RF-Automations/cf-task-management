"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Info,
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  ArrowRight,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { Task } from "@/types/common";
import { useRouter } from "next/navigation";
import { completeOnboarding, createUserInDB } from "./_actions";
import { useAuth, useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import axios from "axios";
import { BASE_BACKEND_URL } from "@/lib/constant";
import Status from "@/components/Status";

// Welcome messages array for random selection
const welcomeMessages = [
  "Welcome to Code First! Ready to build something amazing?",
  "Hey there, coder! Excited to have you join our community!",
  "Welcome aboard! Let's turn your ideas into code.",
  "Hello and welcome! Your coding journey starts here.",
  "Great to see you at Code First! Let's start building together.",
];

const OnboardingFlow = () => {
  // Generate random welcome message
  const randomWelcomeMessage =
    welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
  const { user } = useUser();
  const navigate = useRouter();
  const { getToken } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isAccountApproved, setIsAccountApproved] = useState(
    user?.publicMetadata?.approved
  );
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [error, setError] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  const [profile, setProfile] = useState({
    college: "Gov Polytechnic Adityapur College",
    experience: "Test, test,test,test",
    skills: "test, test,test",
    goals: "test,testest,test",
  });

  useEffect(() => {
    console.log(user?.publicMetadata.role);
    if (user?.publicMetadata?.role && user.publicMetadata.role === "admin") {
      navigate.push("/" + user.publicMetadata.role);
      return;
    }
    setIsAccountApproved(user?.publicMetadata?.approved);
  }, [user, navigate]);

  // Mock tasks
  const tasks: Task[] = [
    {
      id: "1",
      title: "Build a Responsive Portfolio Website",
      difficulty_level: "easy",
      description:
        "Create a personal portfolio website with responsive design using HTML, CSS, and JavaScript.",
      prerequisites: "Basic knowledge of HTML, CSS, and JavaScript",
      outcomes:
        "Understanding of responsive design, DOM manipulation, and deployment",
      status: "inprogress",
    },
    {
      id: "2",
      title: "Develop a Weather App",
      difficulty_level: "medium",
      description:
        "Build a web app that fetches and displays weather data from a public API.",
      prerequisites: "JavaScript fundamentals, API integration experience",
      outcomes:
        "Working with APIs, state management, and asynchronous JavaScript",
      status: "inprogress",
    },
    {
      id: "3",
      title: "Create a Full-Stack Todo Application",
      difficulty_level: "moderate",
      description:
        "Build a complete todo application with authentication, database storage, and CRUD operations.",
      prerequisites: "Experience with React and backend technologies",
      outcomes:
        "Full-stack development skills, authentication, and database management",
      status: "inprogress",
    },
    {
      id: "4",
      title: "Develop a Social Media Dashboard",
      difficulty_level: "hard",
      description:
        "Create a dashboard that integrates with social media APIs to display analytics and metrics.",
      prerequisites: "Proficient in React, data visualization, API integration",
      outcomes:
        "Complex state management, data visualization, and multi-API integration",
      status: "inprogress",
    },
  ];

  const handleContinueStep1 = async () => {
    setLoading(true);
    const user = await createUserInDB();
    console.log(user);

    if (user.data?.userId) {
      toast.success("Welcome to Code First.");
      setStep(2);
    }
    if (user?.error) {
      toast.warning(`Some error occured: ${user?.error}`);
    }
    setLoading(false);
  };

  const handleProfileSubmit = async (e: FormEvent) => {
    setLoading(true);
    e.preventDefault();
    const token = await getToken();
    const userId = user?.publicMetadata?.dbUserId;

    console.log("handleProfileSubmit: ", token, userId);
    if (!token) {
      toast.warning("Login Again please.");
      return;
    }

    if (!userId) {
      toast.warning("User not found.");
      return;
    }

    console.log(profile);

    if (
      profile.college === "" ||
      profile.experience === "" ||
      profile.skills === "" ||
      profile.goals === ""
    ) {
      toast.warning("Complete the form.");
      return;
    }
    try {
      console.log("Base Url: " + BASE_BACKEND_URL, profile);
      const res: any = await axios.post(
        `${BASE_BACKEND_URL}/user/update`,
        {
          userId,
          college_name: profile.college,
          previous_experience: profile.experience,
          current_skills: profile.skills,
          learning_goals: profile.goals,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("try res: ", res);
      if (res.data?.data.id) {
        toast.success("Profile Updated.");
        setStep(3);
      } else if (res.data?.error) {
        toast.error("server side problem");
        console.log(res.data?.error);
      }
    } catch (error: any) {
      toast.error(error?.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRulesAccepted = () => {
    if (selectedTask) {
      setStep(5);
    } else {
      setStep(4);
    }
  };

  const handleTaskPreview = (taskId: any) => {
    setSelectedTask(tasks.find((task) => task.id === taskId));
  };
  console.log(selectedTask);

  const handleTaskAssign = async () => {
    setLoading(true);

    if (!selectedTask) {
      toast.warning("Select the task first.");
      return;
    }

    const token = getToken();
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
      const task = await axios.post(
        `${BASE_BACKEND_URL}/tasks/assign`,
        {
          userId,
          task: selectedTask,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (task.data?.data) {
        toast.success("Wait for moderator to assign the task.");
        setSelectedTask(task.data?.data);
        setStep(5);
      }
    } catch (error: any) {
      toast.error(error?.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const compeleteOnboarding = async () => {
    console.log("onboarding compelete.");
    setLoading(false);
    const res = await completeOnboarding();
    if (res?.message) {
      // Reloads the user's data from the Clerk API
      await user?.reload();
      navigate.push(`/${user?.publicMetadata?.role}`);
    }
    if (res?.error) {
      setError(res?.error);
    }
    setLoading(true);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 px-2">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {randomWelcomeMessage}
                </CardTitle>
                <CardDescription>
                  Learn, build, and grow with our coding community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center mb-4">
                  <div className="text-center p-4">
                    <Info className="h-10 w-10 text-blue-500 mx-auto mb-2" />
                    <p>Platform introduction video would play here</p>
                  </div>
                </div>

                {!isAccountApproved ? (
                  <Alert className="bg-yellow-50 border-yellow-200">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <AlertTitle>Waiting for approval</AlertTitle>
                    <AlertDescription>
                      Your account is pending approval from an admin or
                      moderator.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle>Account approved</AlertTitle>
                    <AlertDescription>
                      🎉 Hurray!!!, your account is approved. See you in
                      community.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter>
                <div className="space-x-2">
                  <Button
                    onClick={handleContinueStep1}
                    variant="ghost"
                    className="group"
                    disabled={!isAccountApproved || loading}
                  >
                    {loading && (
                      <Loader2 className="h-4 w-4 text-yellow-600 animate-spin" />
                    )}
                    Continue{" "}
                    <ArrowRight className="group-hover:translate-x-1 transition-all duration-200" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        );

      case 2:
        return (
          <form className="space-y-6 px-2 w-full max-w-3xl mx-auto">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">
                  Your Profile & Experience
                </CardTitle>
                <CardDescription className="text-sm md:text-base">
                  Tell us about yourself so we can personalize your experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="college" className="text-sm md:text-base">
                      College/University
                    </Label>
                    <Input
                      id="college"
                      placeholder="Enter your institution"
                      value={profile.college}
                      required
                      onChange={(e: any) =>
                        setProfile({ ...profile, college: e.target.value })
                      }
                      className="w-full"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label
                      htmlFor="experience"
                      className="text-sm md:text-base"
                    >
                      Previous Experience (if any)
                    </Label>
                    <Textarea
                      id="experience"
                      placeholder="Share your previous coding experience, if any. (seperate each experience with ',')"
                      value={profile.experience}
                      required
                      onChange={(e: any) =>
                        setProfile({ ...profile, experience: e.target.value })
                      }
                      className="w-full min-h-24"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="skills" className="text-sm md:text-base">
                      Current Skills
                    </Label>
                    <Textarea
                      id="skills"
                      placeholder="What programming languages and technologies are you familiar with? (seperate each skills with ',')"
                      value={profile.skills}
                      required
                      onChange={(e: any) =>
                        setProfile({ ...profile, skills: e.target.value })
                      }
                      className="w-full min-h-24"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="goals" className="text-sm md:text-base">
                      Learning Goals
                    </Label>
                    <Textarea
                      id="goals"
                      placeholder="What do you hope to learn or achieve in this community? (seperate your learning goals with ',')"
                      value={profile.goals}
                      required
                      onChange={(e: any) =>
                        setProfile({ ...profile, goals: e.target.value })
                      }
                      className="w-full min-h-24"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end md:justify-start">
                <Button
                  type="submit"
                  onClick={handleProfileSubmit}
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  {loading && (
                    <Loader2 className="h-4 w-4 text-yellow-600 animate-spin mr-2" />
                  )}
                  Go to Continue
                </Button>
              </CardFooter>
            </Card>
          </form>
        );

      case 3:
        return (
          <div className="space-y-6 px-2">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Community Rules & Guidelines</CardTitle>
                <CardDescription>
                  Please review and accept our community guidelines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Important Information</AlertTitle>
                    <AlertDescription>
                      Understanding and following these guidelines will help you
                      succeed in our community.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <p>
                        <strong>Task Deadlines:</strong> All tasks will have
                        deadlines ranging from 1 to 4 weeks, depending on
                        complexity.
                      </p>
                    </div>

                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <p>
                        <strong>Notifications:</strong> You&apos;ll receive
                        notifications after task assignments, approvals, and
                        deadlines.
                      </p>
                    </div>

                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <p>
                        <strong>Task Selection:</strong> You must select one
                        task from the four options provided to you.
                      </p>
                    </div>

                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <p>
                        <strong>Reassignments:</strong> Incomplete or incorrect
                        submissions may be reassigned for improvement.
                      </p>
                    </div>

                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <p>
                        <strong>Progression:</strong> Completing tasks increases
                        your level and unlocks new opportunities.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-4">
                    <Checkbox
                      id="rules"
                      checked={rulesAccepted}
                      onCheckedChange={setRulesAccepted as any}
                    />
                    <Label htmlFor="rules">
                      I have read and agree to follow the community guidelines
                    </Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleRulesAccepted} disabled={!rulesAccepted}>
                  Continue
                </Button>
              </CardFooter>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 px-2 overflow-y-scroll">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Task Assignment</CardTitle>
                <CardDescription>
                  Choose one task from the options below
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedTask ? (
                  <div className="space-y-4">
                    <Alert className="bg-blue-50 border-blue-200">
                      <Info className="h-4 w-4 text-blue-600" />
                      <AlertTitle>{selectedTask.title}</AlertTitle>
                      <AlertDescription>
                        {selectedTask.description}
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-2">
                      <h4 className="font-medium">Prerequisites:</h4>
                      <p className="text-sm text-gray-600">
                        {selectedTask.prerequisites}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Learning Outcomes:</h4>
                      <p className="text-sm text-gray-600">
                        {selectedTask.outcomes}
                      </p>
                    </div>

                    <div className="pt-4">
                      <Button onClick={handleTaskAssign}>
                        Self-Assign This Task
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setSelectedTask(undefined)}
                        className="ml-2"
                      >
                        Back to Task List
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Please select one task that matches your skill level and
                      interests.
                    </p>

                    <RadioGroup className="space-y-4">
                      {tasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-start space-x-2"
                        >
                          <div className="grid gap-1.5 leading-none">
                            <Label
                              htmlFor={`task-${task.id}`}
                              className="font-medium"
                            >
                              {task.title}
                              <span
                                className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                                  task.difficulty_level === "easy"
                                    ? "bg-green-100 text-green-800"
                                    : task.difficulty_level === "medium"
                                      ? "bg-blue-100 text-blue-800"
                                      : task.difficulty_level === "moderate"
                                        ? "bg-orange-100 text-orange-800"
                                        : "bg-red-100 text-red-800"
                                }`}
                              >
                                {task.difficulty_level}
                              </span>
                            </Label>
                            <p className="text-sm text-gray-500">
                              {task.description}
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-fit mt-1"
                              onClick={() => handleTaskPreview(task.id)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 px-2">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Welcome to Your Dashboard</CardTitle>
                <CardDescription>
                  You&apos;re all set! Your task has been assigned.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Current Task Status</Label>
                      <Status status={selectedTask?.status as any} />
                    </div>
                  </div>

                  <div className="border rounded-md p-4 bg-gray-50">
                    <h3 className="font-medium mb-2">
                      Task: {selectedTask?.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {selectedTask?.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>
                        {selectedTask?.deadLine ? (
                          <span className="flex gap-1">
                            <Clock className="h-4 w-4 mr-1" />
                            <span className="font-bold">Deadline:</span>{" "}
                            selectedTask?.deadLine.toLocaleString()
                          </span>
                        ) : (
                          <span className="flex gap-2">
                            <Loader2 className="h-4 w-4 text-yellow-600 animate-spin" />
                            &quot;Moderator will review and approve your
                            task&qout;
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={compeleteOnboarding} disabled={loading}>
                  {loading && (
                    <Loader2 className="h-4 w-4 text-yellow-600 animate-spin" />
                  )}
                  Go to Dashboard
                </Button>
              </CardFooter>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-full flex flex-col justify-start items-center border mx-auto py-8">
      <div className="mb-8 relative mt-12 md:mt-20">
        <h2 className="text-2xl font-bold mb-4">Code First Onboarding</h2>
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${(step / 5) * 100}%` }}
            ></div>
          </div>
          <span className="ml-2 text-sm font-medium">{step}/5</span>
        </div>
        {step > 1 && (
          <Button
            className="w-fit absolute -bottom-2 -right-16 md:-right-20"
            variant="outline"
            onClick={() => {
              setStep((prev) => prev - 1);
            }}
          >
            <ArrowLeft />
          </Button>
        )}
      </div>
      {renderStep()}
      {error && <p className="text-red-600">Error: {error}</p>}
    </div>
  );
};

export default OnboardingFlow;
