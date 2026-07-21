"use client";

import { useApp } from "@/lib/store";
import { getTodayDateString } from "@/lib/date";
import { PriorityBadge } from "@/components/PriorityBadge";

export default function TodayPage() {
  const { tasks, toggleDone, removeTask } = useApp();
  const today = getTodayDateString();
  const todayTasks = tasks
    .filter((t) => t.scheduledDate === today)
    .sort((a, b) => (a.scheduledTime ?? "99:99").localeCompare(b.scheduledTime ?? "99:99"));

  return (
    <div className="flex-1 flex flex-col px-4 pt-6 pb-4 gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Сьогодні</h1>
        <p className="text-neutral-500 text-sm mt-1">Чекліст задач на сьогодні.</p>
      </div>

      {todayTasks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 text-neutral-400">
          <span className="text-5xl">✅</span>
          <p className="text-base">
            На сьогодні поки нічого немає.
            <br />
            Перенеси задачі з «Вхідних».
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {todayTasks.map((task) => {
            const isDone = task.status === "done";
            return (
              <li
                key={task.id}
                className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:bg-neutral-900 dark:border-neutral-800"
              >
                <button
                  type="button"
                  onClick={() => toggleDone(task.id)}
                  aria-label={
                    isDone ? "Позначити невиконаним" : "Позначити виконаним"
                  }
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
                        <span className="text-xs text-neutral-500">
                          🕐 {task.scheduledTime}
                        </span>
                      )}
                      {task.deadline && (
                        <span className="text-xs text-neutral-500">
                          📅 {task.deadline}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeTask(task.id)}
                  aria-label="Видалити"
                  className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-neutral-400"
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
