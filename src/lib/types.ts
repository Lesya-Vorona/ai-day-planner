export type TaskStatus = "inbox" | "today" | "done";

export interface Task {
  id: string;
  text: string;
  createdAt: number;
  status: TaskStatus;
}
