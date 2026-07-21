"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { CaptureEntry, ParsedTask, Task, User } from "./types";

const USER_KEY = "ai-planner:user:v2";
const TASKS_KEY = "ai-planner:tasks:v2";
const CAPTURES_KEY = "ai-planner:captures:v2";

interface AppContextValue {
  isReady: boolean;
  user: User | null;
  createUser: (name: string) => void;
  tasks: Task[];
  captures: CaptureEntry[];
  addCaptureAndTasks: (
    rawText: string,
    parsedTasks: ParsedTask[],
    source: "voice" | "text"
  ) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  scheduleTask: (id: string, date: string) => void;
  toggleDone: (id: string) => void;
  removeTask: (id: string) => void;
  draftText: string;
  setDraftText: (text: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [captures, setCaptures] = useState<CaptureEntry[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [draftText, setDraftText] = useState("");

  useEffect(() => {
    // localStorage is unavailable during SSR, so the one-time load into state
    // has to happen post-mount rather than via a lazy useState initializer.
    try {
      const rawUser = localStorage.getItem(USER_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (rawUser) setUser(JSON.parse(rawUser));

      const rawTasks = localStorage.getItem(TASKS_KEY);
      if (rawTasks) setTasks(JSON.parse(rawTasks));

      const rawCaptures = localStorage.getItem(CAPTURES_KEY);
      if (rawCaptures) setCaptures(JSON.parse(rawCaptures));
    } catch {
      // corrupted storage, start fresh
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  }, [user, isReady]);

  useEffect(() => {
    if (!isReady) return;
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }, [tasks, isReady]);

  useEffect(() => {
    if (!isReady) return;
    localStorage.setItem(CAPTURES_KEY, JSON.stringify(captures));
  }, [captures, isReady]);

  function createUser(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    setUser({ id: crypto.randomUUID(), name: trimmed, createdAt: Date.now() });
  }

  function addCaptureAndTasks(
    rawText: string,
    parsedTasks: ParsedTask[],
    source: "voice" | "text"
  ) {
    if (!user || parsedTasks.length === 0) return;

    const newTasks: Task[] = parsedTasks.map((parsed) => ({
      id: crypto.randomUUID(),
      userId: user.id,
      title: parsed.title,
      rawInput: rawText,
      status: "inbox",
      priority: parsed.priority,
      scheduledDate: null,
      scheduledTime: parsed.scheduledTime,
      deadline: parsed.deadline,
      createdAt: Date.now(),
      completedAt: null,
      source,
    }));

    const entry: CaptureEntry = {
      id: crypto.randomUUID(),
      userId: user.id,
      rawText,
      createdAt: Date.now(),
      parsedTaskIds: newTasks.map((t) => t.id),
    };

    setTasks((prev) => [...newTasks, ...prev]);
    setCaptures((prev) => [entry, ...prev]);
  }

  function updateTask(id: string, patch: Partial<Task>) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  function scheduleTask(id: string, date: string) {
    updateTask(id, { status: "scheduled", scheduledDate: date });
  }

  function toggleDone(id: string) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const isDone = t.status === "done";
        return {
          ...t,
          status: isDone ? "scheduled" : "done",
          completedAt: isDone ? null : Date.now(),
        };
      })
    );
  }

  function removeTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <AppContext.Provider
      value={{
        isReady,
        user,
        createUser,
        tasks,
        captures,
        addCaptureAndTasks,
        updateTask,
        scheduleTask,
        toggleDone,
        removeTask,
        draftText,
        setDraftText,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
