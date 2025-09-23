"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import type { Task } from "@/types";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import TaskCard from "@/components/TaskCard";
import TaskModal from "@/components/TaskModal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus } from "lucide-react";

const STATUSES = [
  { key: "todo", title: "To do" },
  { key: "in-progress", title: "In progress" },
  { key: "done", title: "Done" },
] as const;

export default function ProjectBoardPage() {
  const { projectId } = useParams();
  const projectIdStr = (Array.isArray(projectId) ? projectId[0] : projectId)
    ?.trim();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [editing, setEditing] = useState<Task | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks on mount or when projectId changes
  useEffect(() => {
    (async () => {
      if (!projectIdStr) return;
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/tasks`);
        setTasks(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
        setError("Failed to load tasks.");
      } finally {
        setLoading(false);
      }
    })();
  }, [projectIdStr]);

  // Handle drag and drop
  const onDragEnd = async (res: DropResult) => {
    const { destination, source, draggableId } = res;
    if (!destination) return;

    const newStatus = destination.droppableId as Task["status"];
    // If dropped in same column and same index, do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Keep a copy to rollback if needed
    const prevTasks = [...tasks];

    // Optimistic update: move task's status (and position within its column is not preserved here)
    setTasks((prev) =>
      prev.map((t) => (t.id === draggableId ? { ...t, status: newStatus } : t))
    );

    try {
      await api.patch(`/tasks/${draggableId}`, { status: newStatus });
    } catch (err) {
      console.error("Failed to update task status", err);
      // Rollback to previous state (or re-fetch)
      try {
        const r = await api.get(`/tasks/${projectIdStr}`);
        setTasks(r.data.data || []);
      } catch (fetchErr) {
        console.error("Failed to refetch tasks after update failure", fetchErr);
        setTasks(prevTasks);
      }
    }
  };

  // Delete task
  const deleteTask = async (id: string) => {
    const confirmed = true; 
    if (!confirmed) return;

    // Optimistic remove
    const prev = [...tasks];
    setTasks((p) => p.filter((t) => t.id !== id));

    try {
      await api.delete(`/tasks/${id}`);
    } catch (err) {
      console.error("Failed to delete task", err);
      // rollback
      setTasks(prev);
    }
  };

  // Save task (add or edit)
  const saveTask = (saved: Task) => {
    const exists = tasks.some((t) => t.id === saved.id);
    if (exists) {
      setTasks((p) => p.map((t) => (t.id === saved.id ? saved : t)));
    } else {
      setTasks((p) => [saved, ...p]);
    }
  };

  return (
    <section className="p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Project Board</h2>
        <Button
          className="bg-green-600 text-white hover:bg-green-700"
          onClick={() => setAddOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>

      {/* Loading / Error */}
      {loading && <div className="mb-4">Loading tasks...</div>}
      {error && <div className="mb-4 text-red-600">{error}</div>}

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STATUSES.map((col) => (
            <Droppable droppableId={col.key} key={col.key}>
              {(provided, snapshot) => {
                const columnTasks = tasks.filter((t) => t.status === col.key);
                return (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`bg-gray-50 rounded-2xl p-4 shadow-sm min-h-[350px] border ${
                      snapshot.isDraggingOver ? "ring-2 ring-blue-300" : ""
                    }`}
                  >
                    <h3 className="text-lg font-semibold mb-4">{col.title}</h3>
                    <div className="space-y-3">
                      {columnTasks.length === 0 && !loading ? (
                        <div className="text-sm text-gray-500">No tasks</div>
                      ) : (
                        columnTasks.map((task, i) => (
                          <Draggable
                            key={task.id}
                            draggableId={String(task.id)}
                            index={i}
                          >
                            {(pd, snapshotDraggable) => (
                              <div
                                ref={pd.innerRef}
                                {...pd.draggableProps}
                                {...pd.dragHandleProps}
                                className="bg-white rounded-xl p-3 shadow hover:shadow-md transition"
                              >
                                <div className="flex justify-between items-start relative">
                                  {/* Task card */}
                                  <TaskCard task={task} />

                                  {/* Dropdown for Task Actions */}
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem
                                        onClick={() => setEditing(task)}
                                      >
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        className="text-red-600"
                                        onClick={() => deleteTask(task.id)}
                                      >
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  </div>
                );
              }}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Task Modals */}
      <TaskModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSaved={saveTask}
        projectId={projectIdStr}
      />
      {editing && (
        <TaskModal
          open={!!editing}
          onClose={() => setEditing(null)}
          onSaved={(saved) => {
            saveTask(saved);
            setEditing(null);
          }}
          initial={editing}
        />
      )}
    </section>
  );
}
