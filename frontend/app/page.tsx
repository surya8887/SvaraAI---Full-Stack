// app/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import type { Project, Task } from "@/types";
import ChartSummary from "@/components/ChartSummary";

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [pRes, tRes] = await Promise.all([api.get("/projects"), api.get("/tasks")]);
        setProjects(pRes.data);
        setTasks(tRes.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const summary = {
    todo: tasks.filter((t) => t.status === "todo").length,
    "in-progress": tasks.filter((t) => t.status === "in-progress").length,
    done: tasks.filter((t) => t.status === "done").length
  } as Record<string, number>;

  const overdue = tasks.filter((t) => t.deadline && new Date(t.deadline) < new Date()).length;

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Projects</div>
          <div className="text-2xl font-bold">{projects.length}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Overdue</div>
          <div className="text-2xl font-bold">{overdue}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Total tasks</div>
          <div className="text-2xl font-bold">{tasks.length}</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Tasks by status</h3>
        <ChartSummary data={summary} />
      </div>
    </section>
  );
}
