"use client";
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import type { Project, Task } from "@/types";
import ChartSummary from "@/components/ChartSummary";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [pRes, tRes] = await Promise.all([api.get("/projects/"), api.get("/tasks/")]);
        setProjects(pRes.data.data);
        setTasks(tRes.data.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const summary = {
    todo: tasks.filter((t) => t.status === "todo").length,
    "in-progress": tasks.filter((t) => t.status === "in-progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  } as Record<string, number>;

  const overdue = tasks.filter((t) => t.deadline && new Date(t.deadline) < new Date()).length;

  // Bar chart data: tasks per project
  const tasksPerProject = projects.map((p) => ({
    name: p.name,
    tasks: tasks.filter((t) => t.projectId === p._id).length,
  }));

  // Line chart data: tasks due next 7 days
  const today = new Date();
  const next7Days = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i);
    return {
      date: date.toISOString().split("T")[0],
      due: tasks.filter(
        (t) => t.deadline && new Date(t.deadline).toISOString().split("T")[0] === date.toISOString().split("T")[0]
      ).length,
    };
  });

  return (
    <section className="space-y-6">
      {/* Summary Cards */}
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

      {/* Tasks by Status Pie Chart */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Tasks by Status</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={Object.entries(summary).map(([key, value]) => ({ name: key, value }))}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              label
            >
              {Object.entries(summary).map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Tasks per Project Bar Chart */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Tasks per Project</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={tasksPerProject}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="tasks" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tasks Due Next 7 Days Line Chart */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Tasks Due (Next 7 Days)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={next7Days}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="due" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
