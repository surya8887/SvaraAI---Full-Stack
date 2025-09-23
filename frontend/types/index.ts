// types/index.ts
export type Priority = "low" | "medium" | "high";
export type Status = "todo" | "in-progress" | "done";

export interface User {
  id: string;
  usrname: string;
  email: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  deadline?: string; // ISO string
  projectId: string;
  createdAt?: string;
  updatedAt?: string;
}
