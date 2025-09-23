// components/ProjectCard.tsx
"use client";
import React from "react";
import { Project } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import Link from "next/link";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="flex flex-col justify-between h-full">
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{project.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">{project.createdAt ? new Date(project.createdAt).toLocaleDateString() : ""}</span>
          <Link href={`/projects/${project.id}`} className="text-sm text-primary">
            Open
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
