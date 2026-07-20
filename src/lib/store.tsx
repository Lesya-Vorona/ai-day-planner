"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Task, TaskStatus } from "./types";

const STORAGE_KEY = "ai-planner:tasks";

interface TasksContextValue {
  tasks: Task[];
  addTask: (text: string) => void;
  setStatus: (id: string, status: TaskStatus) => void;
  removeTask: (id: string) => void;
}

const TasksContext = createContext<TasksContextValue | null>(null);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // localStorage is unavailable during SSR, so the one-time load into state
    // has to happen post-mount rather than via a lazy useState initializer.
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setTasks(JSON.parse(raw));
    } catch {
      // corrupted storage, start fresh
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks, isLoaded]);

  function addTask(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const task: Task = {
      id: crypto.randomUUID(),
      text: trimmed,
      createdAt: Date.now(),
      status: "inbox",
    };
    setTasks((prev) => [task, ...prev]);
  }

  function setStatus(id: string, status: TaskStatus) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  }

  function removeTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <TasksContext.Provider value={{ tasks, addTask, setStatus, removeTask }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be used within TasksProvider");
  return ctx;
}
