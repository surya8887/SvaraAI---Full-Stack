// components/TaskCard.tsx
"use client";
import React from "react";
import { Task } from "@/types";

const priorityClass: Record<string, string> = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800"
};

export default function TaskCard({ task, onEdit, onDelete }: { task: Task; onEdit?: () => void; onDelete?: () => void }) {
  return (
    <article className="bg-white rounded-md shadow p-3">
      <div className="flex justify-between">
        <h4 className="font-medium text-sm">{task.title}</h4>
        <span className={`px-2 py-0.5 text-xs rounded ${priorityClass[task.priority]}`}>{task.priority}</span>
      </div>
      <p className="text-xs text-gray-500 mt-1">{task.deadline ? new Date(task.deadline).toLocaleDateString() : ""}</p>
      <div className="mt-3 flex gap-2 justify-end">
        <button className="text-sm text-primary" onClick={onEdit}>
          Edit
        </button>
        <button className="text-sm text-red-600" onClick={onDelete}>
          Delete
        </button>
      </div>
    </article>
  );
}
