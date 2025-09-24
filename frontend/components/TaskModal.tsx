"use client";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Task, Priority, Status } from "@/types";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Dialog } from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import api from "@/lib/api";

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: (task: Task) => void;
  initial?: Task | null;
  projectId?: string;
};

type FormValues = {
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  deadline?: string;
};

export default function TaskModal({
  open,
  onClose,
  onSaved,
  initial,
  projectId,
}: Props) {
  const form = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      status: "todo",
      deadline: "",
    },
  });

  // Populate form on edit
  useEffect(() => {
    if (initial) {
      form.reset({
        title: initial.title,
        description: initial.description || "",
        priority: initial.priority,
        status: initial.status,
        deadline: initial.deadline ? initial.deadline.split("T")[0] : "",
      });
    } else {
      form.reset({
        title: "",
        description: "",
        priority: "medium",
        status: "todo",
        deadline: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      // fallback for empty priority
      if (!values.priority) values.priority = "medium";
      if (!values.status) values.status = "todo";

      let res;
      if (initial?._id) {
        res = await api.patch(`/tasks/${initial._id}`, values);
        onSaved(res.data.data);
      } else {
        res = await api.post("/tasks", { ...values, projectId });
        onSaved(res.data.data);
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save task");
    }
  });


  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <div className="p-6 w-full max-w-md sm:max-w-full">
        <h3 className="text-lg font-bold mb-5">
          {initial ? "Edit Task" : "Create Task"}
        </h3>
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              {...form.register("title", { required: true })}
              placeholder="Task title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              {...form.register("description")}
              placeholder="Optional task description"
              rows={3}
            />
          </div>

          {/* Priority, Status, Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {/* Priority */}
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <Controller
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <Controller
                control={form.control}
                name="status"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To do</SelectItem>
                      <SelectItem value="in-progress">In progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium mb-1">Deadline</label>
              <Input type="date" {...form.register("deadline")} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-white hover:bg-primary/90"
            >
              {initial ? "Save Task" : "Create Task"}
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
