export interface User {
  id: string;
  name: string;
  createdAt: number;
}

export type TaskStatus = "inbox" | "scheduled" | "done";
export type TaskPriority = "high" | "medium" | "low";
export type TaskSource = "voice" | "text";

export interface Task {
  id: string;
  userId: string;
  title: string;
  rawInput: string;
  status: TaskStatus;
  priority: TaskPriority | null;
  scheduledDate: string | null; // YYYY-MM-DD; Today = scheduledDate === today
  scheduledTime: string | null; // HH:mm
  deadline: string | null; // YYYY-MM-DD
  createdAt: number;
  completedAt: number | null;
  source: TaskSource;
}

export interface CaptureEntry {
  id: string;
  userId: string;
  rawText: string;
  createdAt: number;
  parsedTaskIds: string[];
}

export interface ParsedTask {
  title: string;
  priority: TaskPriority | null;
  scheduledTime: string | null;
  deadline: string | null;
}
