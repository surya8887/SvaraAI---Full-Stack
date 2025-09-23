// app/projects/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import type { Project } from "@/types";
import ProjectCard from "@/components/ProjectCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/projects");
        setProjects(res.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await api.post("/projects", { name, description });
      setProjects((p) => [res.data, ...p]);
      setName("");
      setDescription("");
    } catch (err) {
      alert("Failed to create project");
    }
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Projects</h2>
      </div>

      <form onSubmit={onCreate} className="flex gap-2 mb-6">
        <Input placeholder="Project name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Short description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Button type="submit" className="bg-primary text-white">
          Create
        </Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </section>
  );
}
