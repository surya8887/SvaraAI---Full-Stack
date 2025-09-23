// app/projects/[projectId]/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import type { Task } from "@/types";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import TaskCard from "@/components/TaskCard";
import TaskModal from "@/components/TaskModal";
import { Button } from "@/components/ui/button";

const STATUSES = [
  { key: "todo", title: "To do" },
  { key: "in-progress", title: "In progress" },
  { key: "done", title: "Done" },
] as const;

export default function ProjectBoardPage() {
  const { projectId } = useParams();
  const projectIdStr = Array.isArray(projectId) ? projectId[0] : projectId;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editing, setEditing] = useState<Task | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    (async () => {
      if (!projectId) return;
      try {
        const res = await api.get(`/tasks?projectId=${projectId}`);
        setTasks(res.data);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      }
    })();
  }, [projectId]);

  const onDragEnd = async (res: DropResult) => {
    const { destination, draggableId } = res;
    if (!destination) return;

    const newStatus = destination.droppableId as Task["status"];

    // optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === draggableId ? { ...t, status: newStatus } : t))
    );

    try {
      await api.patch(`/tasks/${draggableId}`, { status: newStatus });
    } catch (err) {
      console.error("Failed to update task status", err);
      // revert on failure
      const r = await api.get(`/tasks?projectId=${projectId}`);
      setTasks(r.data);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((p) => p.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const saveTask = (saved: Task) => {
    const exists = tasks.some((t) => t.id === saved.id);
    if (exists) {
      setTasks((p) => p.map((t) => (t.id === saved.id ? saved : t)));
    } else {
      setTasks((p) => [saved, ...p]);
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Project Board</h2>
        <Button className="bg-green-600 text-white" onClick={() => setAddOpen(true)}>
          Add Task
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STATUSES.map((col) => (
            <Droppable droppableId={col.key} key={col.key}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-50 p-3 rounded min-h-[300px]"
                >
                  <h3 className="font-semibold mb-3">{col.title}</h3>
                  <div className="space-y-3">
                    {tasks
                      .filter((t) => t.status === col.key)
                      .map((task, i) => (
                        <Draggable key={task.id} draggableId={task.id} index={i}>
                          {(pd) => (
                            <div
                              ref={pd.innerRef}
                              {...pd.draggableProps}
                              {...pd.dragHandleProps}
                            >
                              <TaskCard
                                task={task}
                                onEdit={() => setEditing(task)}
                                onDelete={() => deleteTask(task.id)}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

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
          onSaved={saveTask}
          initial={editing}
        />
      )}
    </section>
  );
}
