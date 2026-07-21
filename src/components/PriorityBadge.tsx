import type { TaskPriority } from "@/lib/types";

const LABELS: Record<TaskPriority, string> = {
  high: "Високий",
  medium: "Середній",
  low: "Низький",
};

const STYLES: Record<TaskPriority, string> = {
  high: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  low: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
};

export function PriorityBadge({ priority }: { priority: TaskPriority | null }) {
  if (!priority) return null;
  return (
    <span className={`text-xs font-medium rounded-full px-2 py-1 ${STYLES[priority]}`}>
      {LABELS[priority]}
    </span>
  );
}
