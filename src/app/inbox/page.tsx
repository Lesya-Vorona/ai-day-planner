"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import type { Task, TaskPriority } from "@/lib/types";
import { PriorityBadge } from "@/components/PriorityBadge";
import { getTodayDateString } from "@/lib/date";
import { EmptyState } from "@/components/EmptyState";

const EXAMPLE_PROMPT =
  "Купити хліб, помити машину і подзвонити мамі ввечері";

const PRIORITY_OPTIONS: { value: TaskPriority | ""; label: string }[] = [
  { value: "", label: "Без пріоритету" },
  { value: "high", label: "Високий" },
  { value: "medium", label: "Середній" },
  { value: "low", label: "Низький" },
];

function formatShortDate(date: string) {
  const [, month, day] = date.split("-");
  return `${day}.${month}`;
}

function TaskCard({ task }: { task: Task }) {
  const { updateTask, scheduleTask, removeTask } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState<TaskPriority | "">(task.priority ?? "");
  const [scheduledTime, setScheduledTime] = useState(task.scheduledTime ?? "");
  const [deadline, setDeadline] = useState(task.deadline ?? "");
  const [scheduleDate, setScheduleDate] = useState(task.deadline ?? getTodayDateString());

  function handleSaveEdit() {
    if (!title.trim()) return;
    updateTask(task.id, {
      title: title.trim(),
      priority: priority || null,
      scheduledTime: scheduledTime || null,
      deadline: deadline || null,
    });
    setIsEditing(false);
  }

  function handleCancelEdit() {
    setTitle(task.title);
    setPriority(task.priority ?? "");
    setScheduledTime(task.scheduledTime ?? "");
    setDeadline(task.deadline ?? "");
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <li className="rounded-2xl border border-blue-300 bg-white p-4 shadow-sm dark:bg-neutral-900 dark:border-blue-800">
        <div className="flex flex-col gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-12 rounded-xl border border-neutral-200 bg-white px-3 text-base dark:bg-neutral-900 dark:border-neutral-800"
            placeholder="Назва задачі"
            autoFocus
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority | "")}
            className="h-12 rounded-xl border border-neutral-200 bg-white px-3 text-base dark:bg-neutral-900 dark:border-neutral-800"
          >
            {PRIORITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="h-12 rounded-xl border border-neutral-200 bg-white px-3 text-base dark:bg-neutral-900 dark:border-neutral-800"
            />
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="h-12 rounded-xl border border-neutral-200 bg-white px-3 text-base dark:bg-neutral-900 dark:border-neutral-800"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSaveEdit}
              className="flex-1 h-12 rounded-xl bg-neutral-900 text-white text-sm font-medium active:scale-[0.98] transition-transform dark:bg-white dark:text-neutral-900"
            >
              Зберегти
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="flex-1 h-12 rounded-xl bg-neutral-100 text-neutral-600 text-sm font-medium active:scale-[0.98] transition-transform dark:bg-neutral-800 dark:text-neutral-300"
            >
              Скасувати
            </button>
          </div>
        </div>
      </li>
    );
  }

  const isToday = scheduleDate === getTodayDateString();

  return (
    <li className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:bg-neutral-900 dark:border-neutral-800">
      <p className="text-base leading-snug whitespace-pre-wrap">{task.title}</p>

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

      <div className="flex flex-col gap-2 mt-3">
        <div className="flex gap-2">
          <input
            type="date"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            aria-label="Дата планування"
            className="h-12 w-36 rounded-xl border border-neutral-200 bg-white px-2 text-sm dark:bg-neutral-900 dark:border-neutral-800"
          />
          <button
            type="button"
            onClick={() => scheduleTask(task.id, scheduleDate)}
            disabled={!scheduleDate}
            className="flex-1 h-12 rounded-xl bg-blue-600 text-white text-sm font-medium disabled:opacity-30 active:scale-[0.98] transition-transform"
          >
            {isToday ? "На сьогодні" : `Запланувати на ${formatShortDate(scheduleDate)}`}
          </button>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex-1 h-12 rounded-xl bg-neutral-100 text-neutral-500 text-sm font-medium active:scale-[0.98] transition-transform dark:bg-neutral-800"
          >
            ✏️ Редагувати
          </button>
          <button
            type="button"
            onClick={() => removeTask(task.id)}
            className="flex-1 h-12 rounded-xl bg-neutral-100 text-neutral-500 text-sm font-medium active:scale-[0.98] transition-transform dark:bg-neutral-800"
          >
            🗑️ Видалити
          </button>
        </div>
      </div>
    </li>
  );
}

export default function InboxPage() {
  const { tasks, setDraftText } = useApp();
  const router = useRouter();
  const inboxTasks = tasks.filter((t) => t.status === "inbox");

  function goToCapture() {
    router.push("/");
  }

  function tryExample() {
    setDraftText(EXAMPLE_PROMPT);
    router.push("/");
  }

  return (
    <div className="flex-1 flex flex-col px-4 pt-6 pb-4 gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Завдання</h1>
        <p className="text-neutral-500 text-sm mt-1">
          Розібрані задачі з&apos;являться тут.
        </p>
      </div>

      {inboxTasks.length === 0 ? (
        <EmptyState
          icon="📋"
          gradient="from-blue-100 to-indigo-50 dark:from-blue-950 dark:to-indigo-950"
          title="Тут поки тихо"
          subtitle="Жодної думки ще не зафіксовано. Скажи або напиши все, що в голові, — AI розкладе на задачі."
        >
          <button
            type="button"
            onClick={goToCapture}
            className="h-14 rounded-2xl bg-neutral-900 text-white text-base font-medium active:scale-[0.98] transition-transform dark:bg-white dark:text-neutral-900"
          >
            🎤 Записати план
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
          {inboxTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </ul>
      )}
    </div>
  );
}
