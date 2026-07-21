"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { getTodayDateString } from "@/lib/date";
import { PriorityBadge } from "@/components/PriorityBadge";
import { EmptyState } from "@/components/EmptyState";
import type { Task } from "@/lib/types";

const EXAMPLE_PROMPT =
  "Купити хліб, помити машину і подзвонити мамі ввечері";

const AUTO_REMOVE_DELAY = 5000;
const FADE_OUT_DURATION = 300;

export default function TodayPage() {
  const { tasks, toggleDone, removeTask, setDraftText } = useApp();
  const router = useRouter();
  const [leavingIds, setLeavingIds] = useState<Set<string>>(new Set());
  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const today = getTodayDateString();
  const todayTasks = tasks
    .filter((t) => t.scheduledDate === today)
    .sort((a, b) => (a.scheduledTime ?? "99:99").localeCompare(b.scheduledTime ?? "99:99"));
  const inboxCount = tasks.filter((t) => t.status === "inbox").length;

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      Object.values(timers).forEach(clearTimeout);
    };
  }, []);

  function clearScheduledRemoval(id: string) {
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
    setLeavingIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function scheduleRemoval(id: string) {
    clearScheduledRemoval(id);
    timersRef.current[id] = setTimeout(() => {
      setLeavingIds((prev) => new Set(prev).add(id));
      timersRef.current[id] = setTimeout(() => {
        removeTask(id);
        delete timersRef.current[id];
      }, FADE_OUT_DURATION);
    }, AUTO_REMOVE_DELAY);
  }

  function handleToggle(task: Task) {
    const willBeDone = task.status !== "done";
    toggleDone(task.id);
    if (willBeDone) {
      scheduleRemoval(task.id);
    } else {
      clearScheduledRemoval(task.id);
    }
  }

  function handleRemove(id: string) {
    clearScheduledRemoval(id);
    removeTask(id);
  }

  function tryExample() {
    setDraftText(EXAMPLE_PROMPT);
    router.push("/");
  }

  return (
    <div className="flex-1 flex flex-col px-4 pt-6 pb-4 gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Сьогодні</h1>
        <p className="text-neutral-500 text-sm mt-1">Чекліст задач на сьогодні.</p>
      </div>

      {todayTasks.length === 0 && inboxCount > 0 ? (
        <EmptyState
          icon="📬"
          gradient="from-amber-100 to-orange-50 dark:from-amber-950 dark:to-orange-950"
          title={`У «Вхідних» чекає ${inboxCount} ${
            inboxCount === 1 ? "задача" : "задачі"
          }`}
          subtitle="Перенеси щось на сьогодні — і тут з'явиться твій чекліст."
        >
          <button
            type="button"
            onClick={() => router.push("/inbox")}
            className="h-14 rounded-2xl bg-neutral-900 text-white text-base font-medium active:scale-[0.98] transition-transform dark:bg-white dark:text-neutral-900"
          >
            📥 Перейти до вхідних
          </button>
        </EmptyState>
      ) : todayTasks.length === 0 ? (
        <EmptyState
          icon="✅"
          gradient="from-emerald-100 to-teal-50 dark:from-emerald-950 dark:to-teal-950"
          title="На сьогодні поки нічого немає"
          subtitle="Захопи думку — AI розкладе її на задачі, а ти сплануєш свій день."
        >
          <button
            type="button"
            onClick={() => router.push("/")}
            className="h-14 rounded-2xl bg-neutral-900 text-white text-base font-medium active:scale-[0.98] transition-transform dark:bg-white dark:text-neutral-900"
          >
            🎤 Захопити думку
          </button>
          <button
            type="button"
            onClick={tryExample}
            className="h-14 rounded-2xl bg-white text-neutral-600 text-sm font-medium border border-neutral-200 active:scale-[0.98] transition-transform dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-300"
          >
            ✨ Спробувати на прикладі
          </button>
        </EmptyState>
      ) : (
        <ul className="flex flex-col gap-3">
          {todayTasks.map((task) => {
            const isDone = task.status === "done";
            const isLeaving = leavingIds.has(task.id);
            return (
              <li
                key={task.id}
                className={`flex items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:bg-neutral-900 dark:border-neutral-800 transition-all duration-300 ease-out ${
                  isLeaving ? "opacity-0 scale-95 -translate-x-2" : "opacity-100 scale-100"
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleToggle(task)}
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
                  onClick={() => handleRemove(task.id)}
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
