// components/Header.tsx
"use client";
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b">
      <div className="flex items-center gap-3">
        <Link href="/" className="text-xl font-bold">
          SvaraAI
        </Link>
        <span className="text-sm text-gray-500">Project Studio</span>
      </div>

      <nav className="flex items-center gap-4">
        <Link href="/projects" className="text-sm text-gray-700 hover:text-primary">
          Projects
        </Link>
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{user.name}</span>
            <Button variant="ghost" onClick={logout}>
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/login">
            <Button variant="default">Login</Button>
          </Link>
        )}
      </nav>
    </header>
  );
}
