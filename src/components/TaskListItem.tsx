import type { Task } from "@/lib/types";
import { PriorityBadge } from "@/components/PriorityBadge";

interface TaskListItemProps {
  task: Task;
  isLeaving?: boolean;
  onToggle: (task: Task) => void;
  onRemove: (id: string) => void;
}

export function TaskListItem({
  task,
  isLeaving = false,
  onToggle,
  onRemove,
}: TaskListItemProps) {
  const isDone = task.status === "done";

  return (
    <li
      className={`flex items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:bg-neutral-900 dark:border-neutral-800 transition-all duration-300 ease-out ${
        isLeaving ? "opacity-0 scale-95 -translate-x-2" : "opacity-100 scale-100"
      }`}
    >
      <button
        type="button"
        onClick={() => onToggle(task)}
        aria-label={isDone ? "Позначити невиконаним" : "Позначити виконаним"}
        className={`flex-shrink-0 w-9 h-9 rounded-full border-2 flex items-center justify-center text-lg mt-0.5 ${
          isDone
            ? "bg-green-500 border-green-500 text-white"
            : "border-neutral-300 dark:border-neutral-600"
        }`}
      >
        {isDone ? "✓" : ""}
      </button>
      <div className="flex-1">
        <p
          className={`text-base leading-snug whitespace-pre-wrap ${
            isDone ? "line-through text-neutral-400" : ""
          }`}
        >
          {task.title}
        </p>
        {(task.priority || task.scheduledTime || task.deadline) && (
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <PriorityBadge priority={task.priority} />
            {task.scheduledTime && (
              <span className="text-xs text-neutral-500">🕐 {task.scheduledTime}</span>
            )}
            {task.deadline && (
              <span className="text-xs text-neutral-500">📅 {task.deadline}</span>
            )}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => onRemove(task.id)}
        aria-label="Видалити"
        className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-neutral-400"
      >
        ✕
      </button>
    </li>
  );
}
