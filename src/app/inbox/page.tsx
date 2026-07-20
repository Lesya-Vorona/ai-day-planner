"use client";

import { useTasks } from "@/lib/store";

export default function InboxPage() {
  const { tasks, setStatus, removeTask } = useTasks();
  const inboxTasks = tasks.filter((t) => t.status === "inbox");

  return (
    <div className="flex-1 flex flex-col px-4 pt-6 pb-4 gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Вхідні</h1>
        <p className="text-neutral-500 text-sm mt-1">
          Розібрані задачі з&apos;являться тут.
        </p>
      </div>

      {inboxTasks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 text-neutral-400">
          <span className="text-5xl">📥</span>
          <p className="text-base">
            Поки порожньо.
            <br />
            Додай щось на екрані «Захопити».
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {inboxTasks.map((task) => (
            <li
              key={task.id}
              className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:bg-neutral-900 dark:border-neutral-800"
            >
              <p className="text-base leading-snug whitespace-pre-wrap">
                {task.text}
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setStatus(task.id, "today")}
                  className="flex-1 h-12 rounded-xl bg-blue-600 text-white text-sm font-medium active:scale-[0.98] transition-transform"
                >
                  На сьогодні
                </button>
                <button
                  type="button"
                  onClick={() => removeTask(task.id)}
                  aria-label="Видалити"
                  className="w-12 h-12 flex items-center justify-center rounded-xl bg-neutral-100 text-neutral-500 active:scale-[0.98] transition-transform dark:bg-neutral-800"
                >
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
