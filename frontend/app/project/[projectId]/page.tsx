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
  const projectIdStr = (Array.isArray(projectId) ? projectId[0] : projectId)?.trim();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [editing, setEditing] = useState<Task | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fix ESLint: replace `any` with Task[]
  const normalizeTasks = (arr: Task[]): Task[] => arr?.map((t) => ({ ...t })) || [];

  // Fetch tasks on mount or when projectId changes
  useEffect(() => {
    (async () => {
      if (!projectIdStr) return;
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/tasks/${projectIdStr}`);
        const fetchedTasks: Task[] = res?.data?.data?.tasks ?? [];
        setTasks(normalizeTasks(fetchedTasks));
      } catch (err) {
        console.error("Failed to fetch tasks", err);
        setError("Failed to load tasks.");
      } finally {
        setLoading(false);
      }
    })();
  }, [projectIdStr]);

  const buildColumns = (list: Task[]) => {
    const map: Record<string, Task[]> = {};
    STATUSES.forEach((s) => {
      map[s.key] = list.filter((t) => t.status === s.key);
    });
    return map;
  };

  // Handle drag and drop
  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    const prevTasks = [...tasks];
    const cols = buildColumns(tasks);
    const draggedTask = tasks.find((t) => String(t._id) === String(draggableId));
    if (!draggedTask) return;

    const sourceList = Array.from(cols[source.droppableId] || []);
    const [moved] = sourceList.splice(source.index, 1);

    moved.status = destination.droppableId as Task["status"];

    const destList = Array.from(cols[destination.droppableId] || []);
    destList.splice(destination.index, 0, moved);

    cols[source.droppableId] = sourceList;
    cols[destination.droppableId] = destList;

    const newTasksFlattened: Task[] = [];
    STATUSES.forEach((s) => {
      newTasksFlattened.push(...(cols[s.key] || []));
    });

    setTasks(newTasksFlattened);

    try {
      await api.patch(`/tasks/${draggableId}`, {
        status: moved.status,
        position: destination.index,
        projectId: projectIdStr,
      });
    } catch (err) {
      console.error("Failed to update task status/order", err);
      try {
        const r = await api.get(`/tasks/${projectIdStr}`);
        const fetched = r?.data?.data?.tasks ?? prevTasks;
        setTasks(normalizeTasks(fetched));
      } catch (fetchErr) {
        console.error("Failed to refetch tasks after update failure", fetchErr);
        setTasks(prevTasks);
      }
    }
  };

  const deleteTask = async (id: string) => {
    const confirmed = true;
    if (!confirmed) return;

    const prev = [...tasks];
    setTasks((p) => p.filter((t) => t._id !== id));

    try {
      await api.delete(`/tasks/${id}`);
    } catch (err) {
      console.error("Failed to delete task", err);
      setTasks(prev);
    }
  };

  const saveTask = (saved: Task) => {
    const exists = tasks.some((t) => t._id === saved._id);
    if (exists) {
      setTasks((p) => p.map((t) => (t._id === saved._id ? saved : t)));
    } else {
      setTasks((p) => [saved, ...p]);
    }
  };

  return (
    <section className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Project Board</h2>
        <Button
          className="bg-green-600 text-white hover:bg-green-700"
          onClick={() => setAddOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>

      {loading && <div className="mb-4">Loading tasks...</div>}
      {error && <div className="mb-4 text-red-600">{error}</div>}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STATUSES.map((col) => (
            <Droppable droppableId={col.key} key={col.key}>
              {(provided, _snapshotDraggable) => {
                // Removed unused snapshotDraggable by prefixing with _
                const columnTasks = tasks.filter((t) => t.status === col.key);
                return (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`bg-gray-50 rounded-2xl p-4 shadow-sm min-h-[350px] border ${_snapshotDraggable.isDraggingOver ? "ring-2 ring-blue-300" : ""}`}
                  >
                    <h3 className="text-lg font-semibold mb-4">{col.title}</h3>
                    <div className="space-y-3">
                      {columnTasks.length === 0 && !loading ? (
                        <div className="text-sm text-gray-500">No tasks</div>
                      ) : (
                        columnTasks.map((task, i) => (
                          <Draggable
                            key={String(task._id)}
                            draggableId={String(task._id)}
                            index={i}
                          >
                            {(pd) => (
                              <div
                                ref={pd.innerRef}
                                {...pd.draggableProps}
                                {...pd.dragHandleProps}
                                className="bg-white rounded-xl p-3 shadow hover:shadow-md transition"
                              >
                                <div className="flex justify-between items-start relative">
                                  <TaskCard task={task} />

                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => setEditing(task)}>
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        className="text-red-600"
                                        onClick={() => deleteTask(String(task._id))}
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
