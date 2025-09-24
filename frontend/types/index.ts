// types/index.ts
export type Priority = "low" | "medium" | "high";
export type Status = "todo" | "in-progress" | "done";

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  createdAt?: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  deadline?: string; // ISO string
  projectId: string;
  createdAt?: string;
  updatedAt?: string;
}
