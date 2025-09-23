// app/layout.tsx
import "@/app/globals.css";
import React from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export const metadata = { title: "SvaraAI", description: "Task and Projects" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
