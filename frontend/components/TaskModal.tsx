// components/TaskModal.tsx
"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Task, Priority, Status } from "@/types";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select } from "./ui/select";
import { Button } from "./ui/button";
import { Dialog } from "./ui/dialog";
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

export default function TaskModal({ open, onClose, onSaved, initial, projectId }: Props) {
  const form = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      status: "todo",
      deadline: ""
    }
  });

  useEffect(() => {
    if (initial) {
      form.reset({
        title: initial.title,
        description: initial.description || "",
        priority: initial.priority,
        status: initial.status,
        deadline: initial.deadline ? initial.deadline.split("T")[0] : ""
      });
    } else {
      form.reset({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (initial) {
        const res = await api.patch(`/tasks/${initial.id}`, values);
        onSaved(res.data);
      } else {
        const res = await api.post("/tasks", { ...values, projectId });
        onSaved(res.data);
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save task");
    }
  });

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">{initial ? "Edit Task" : "Create Task"}</h3>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Title</label>
            <Input {...form.register("title", { required: true })} />
          </div>

          <div>
            <label className="block text-sm mb-1">Description</label>
            <Textarea {...form.register("description")} />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-sm mb-1">Priority</label>
              <Select {...form.register("priority")}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm mb-1">Status</label>
              <Select {...form.register("status")}>
                <option value="todo">To do</option>
                <option value="in-progress">In progress</option>
                <option value="done">Done</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm mb-1">Deadline</label>
              <Input type="date" {...form.register("deadline")} />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-white">
              {initial ? "Save" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
