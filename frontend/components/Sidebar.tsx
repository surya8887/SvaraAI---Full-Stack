// components/Sidebar.tsx
"use client";
import React from "react";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4">
      <div className="mb-6">
        <h2 className="font-bold text-lg">Workspace</h2>
        <p className="text-sm text-gray-500">Manage projects & tasks</p>
      </div>

      <nav className="flex flex-col gap-2">
        <Link href="/" className="px-3 py-2 rounded hover:bg-gray-50">Dashboard</Link>
        <Link href="/projects" className="px-3 py-2 rounded hover:bg-gray-50">Projects</Link>
      </nav>
    </aside>
  );
}
