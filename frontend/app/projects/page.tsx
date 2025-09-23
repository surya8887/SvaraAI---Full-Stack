// app/projects/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import type { Project } from "@/types";
import ProjectCard from "@/components/ProjectCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/projects/");

        let data: Project[] = [];

        if (Array.isArray(res.data)) {
          // Case: direct array
          data = res.data;
        } else if (Array.isArray(res.data.data)) {
          // Case: { data: [...] }
          data = res.data.data;
        } else if (res.data?.data?.projects && Array.isArray(res.data.data.projects)) {
          // Case: { data: { projects: [...] } }
          data = res.data.data.projects;
        }

        setProjects(data);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);


  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setCreating(true);
    try {
      const res = await api.post("/projects", { name, description });
      setProjects((prev) => [res.data, ...prev]);
      setName("");
      setDescription("");
    } catch (err) {
      console.error("Failed to create project:", err);
      alert("Failed to create project");
    } finally {
      setCreating(false);
    }
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Projects</h2>
      </div>

      {/* Create form - side by side */}
      <form
        onSubmit={onCreate}
        className="flex flex-col md:flex-row items-stretch gap-3"
      >
        <Input
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="flex-1"
        />
        <Input
          placeholder="Short description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={creating}
          className="flex items-center gap-2 shrink-0"
        >
          {creating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <PlusCircle className="w-4 h-4" />
              Create
            </>
          )}
        </Button>
      </form>

      {/* Projects list */}
      {loading ? (
        <div className="flex justify-center py-10 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="ml-2">Loading projects...</span>
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <ProjectCard key={p._id} project={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          No projects yet. Start by creating one above.
        </div>
      )}
    </section>
  );
}
