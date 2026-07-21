"use client";

import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { getCurrentWeekDates, formatDayLabel, getTodayDateString } from "@/lib/date";
import { EmptyState } from "@/components/EmptyState";
import { TaskListItem } from "@/components/TaskListItem";
import type { Task } from "@/lib/types";

export default function WeekPage() {
  const { tasks, toggleDone, removeTask } = useApp();
  const router = useRouter();
  const today = getTodayDateString();
  const weekDates = getCurrentWeekDates();

  const hasAnyTasks = tasks.some(
    (t) => t.scheduledDate && weekDates.includes(t.scheduledDate)
  );

  function handleToggle(task: Task) {
    toggleDone(task.id);
  }

  return (
    <div className="flex-1 flex flex-col px-4 pt-6 pb-4 gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Тиждень</h1>
        <p className="text-neutral-500 text-sm mt-1">План на весь тиждень.</p>
      </div>

      {!hasAnyTasks ? (
        <EmptyState
          icon="🗓️"
          gradient="from-violet-100 to-purple-50 dark:from-violet-950 dark:to-purple-950"
          title="На цьому тижні поки порожньо"
          subtitle="Запиши план — AI розкладе його на задачі, а ти розподілиш їх по днях."
        >
          <button
            type="button"
            onClick={() => router.push("/")}
            className="h-14 rounded-2xl bg-neutral-900 text-white text-base font-medium active:scale-[0.98] transition-transform dark:bg-white dark:text-neutral-900"
          >
            🎤 Записати план
          </button>
        </EmptyState>
      ) : (
        <div className="flex flex-col gap-5">
          {weekDates.map((date) => {
            const dayTasks = tasks
              .filter((t) => t.scheduledDate === date)
              .sort((a, b) =>
                (a.scheduledTime ?? "99:99").localeCompare(b.scheduledTime ?? "99:99")
              );

            return (
              <div key={date}>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                    {formatDayLabel(date)}
                  </h2>
                  {date === today && (
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 rounded-full px-2 py-0.5">
                      Сьогодні
                    </span>
                  )}
                </div>
                {dayTasks.length > 0 && (
                  <ul className="flex flex-col gap-3">
                    {dayTasks.map((task) => (
                      <TaskListItem
                        key={task.id}
                        task={task}
                        onToggle={handleToggle}
                        onRemove={removeTask}
                      />
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
