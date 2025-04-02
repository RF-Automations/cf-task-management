import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface TaskOption {
  id: string;
  title: string;
  description: string;
  difficulty_level: "easy" | "medium" | "moderate" | "hard";
  outcomes: string;
  status: "assigned" | "submitted" | "reassigned" | "completed" | "inprogress";
  prerequisites?: string;
  deadline?: string;
}

type AssignTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (Task: TaskOption) => void;
  taskOptions: TaskOption[];
};

export function AssignTaskModal({
  isOpen,
  onClose,
  onSubmit,
  taskOptions,
}: AssignTaskModalProps) {
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [selectedTask, setSelectedTask] = useState<TaskOption | null>(null);

  const handleSubmit = () => {
    if (!selectedTask) {
      toast.warning("Please select a task");
      return;
    }

    onSubmit(selectedTask);
    setSelectedTaskId("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Select a Task to Assign</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <RadioGroup value={selectedTaskId} onValueChange={setSelectedTaskId}>
            {taskOptions.map((task) => (
              <div
                key={task.id}
                className="flex items-start space-x-3 border p-4 rounded-lg mb-3 hover:border-primary cursor-pointer"
                onClick={() => setSelectedTask(task)}
              >
                <RadioGroupItem value={task.id} id={task.id} className="mt-1" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <Label
                      htmlFor={task.id}
                      className="font-medium text-base cursor-pointer"
                    >
                      {task.title}
                    </Label>
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

                  <div className="mt-2 space-y-2 text-sm text-gray-500">
                    <p>
                      <span className="font-medium text-gray-700">
                        Description:{" "}
                      </span>
                      {task.description}
                    </p>
                    <p>
                      <span className="font-medium text-gray-700">
                        Expected Outcomes:{" "}
                      </span>
                      {task.outcomes}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Request Approval</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
