import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

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

// Define form schema
const formSchema = z.object({
  githubLink: z.string().url("Please enter a valid GitHub URL"),
  sourceLinks: z.array(
    z.string().url("Please enter a valid URL").or(z.string().length(0))
  ),
});

type TaskDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onSubmit: (data: {
    githubLink: string;
    sourceLinks: string[];
    taskId: string;
  }) => void;
};

export function TaskDetailsModal({
  isOpen,
  onClose,
  task,
  onSubmit,
}: TaskDetailsModalProps) {
  const [sourceLinks, setSourceLinks] = useState<string[]>([""]);


  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      githubLink: "",
      sourceLinks: [""],
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    // Filter out empty source links
    const pmt = prompt(
      "Are you confirm you want to submit you task. You won't be able to edit you submission. yes for continue no for not."
    );
    if (pmt?.toLowerCase() === "no") {
      return;
    } else if (pmt?.toLowerCase() === "yes") {
      const filteredSourceLinks = values.sourceLinks.filter(
        (link: string) => link.trim() !== ""
      );
      console.log(task);

      if (!task){
        toast.error('task not found')
        return;
      }

      onSubmit({
        githubLink: values.githubLink,
        sourceLinks: filteredSourceLinks,
        taskId: task?.id,
      });

      form.reset();
      onClose();
    }
  };

  const addSourceLink = () => {
    setSourceLinks([...sourceLinks, ""]);
    form.setValue("sourceLinks", [...form.getValues("sourceLinks"), ""]);
  };

  const removeSourceLink = (index: number) => {
    const newLinks = [...sourceLinks];
    newLinks.splice(index, 1);
    setSourceLinks(newLinks);

    const formLinks = [...form.getValues("sourceLinks")];
    formLinks.splice(index, 1);
    form.setValue("sourceLinks", formLinks);
  };

  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{task.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <h3 className="font-semibold text-sm">Description</h3>
            <p className="text-sm mt-1">{task.description}</p>
          </div>

          <div>
            <h3 className="font-semibold text-sm">Difficulty Level</h3>
            <div className="mt-1">
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
          </div>

          <div>
            <h3 className="font-semibold text-sm">Expected Outcomes</h3>
            <p className="text-sm mt-1">{task.outcomes}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm">Created At</h3>
            <p className="text-sm mt-1">{new Date(task.createdAt!).toLocaleDateString() + " - " + new Date(task.createdAt!).toLocaleTimeString()}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm">Deadline</h3>
            <p className="text-sm mt-1">{task?.deadline || " - "}</p>
          </div>

          {task.prerequisites && (
            <div>
              <h3 className="font-semibold text-sm">Prerequisites</h3>
              <p className="text-sm mt-1">{task.prerequisites}</p>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-sm">Status</h3>
            <div className="mt-1">
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
                {task?.status!.charAt(0).toUpperCase() + task?.status!.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {task?.status !== "completed" && task?.status !== 'submitted' ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
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
                      control={form.control}
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
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">Submit Task</Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
