"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";

const STEPS = [
  {
    icon: "✏️",
    title: "Захопити",
    text: "Скинь усе, що в голові, — голосом чи текстом, одним потоком.",
  },
  {
    icon: "📥",
    title: "Вхідні",
    text: "AI сам розбере це на окремі задачі з пріоритетом і часом.",
  },
  {
    icon: "✅",
    title: "Сьогодні",
    text: "Перенеси потрібне у список на сьогодні й викреслюй зроблене.",
  },
];

export function Onboarding() {
  const { createUser } = useApp();
  const [name, setName] = useState("");

  function handleSubmit() {
    if (!name.trim()) return;
    createUser(name);
  }

  return (
    <div className="flex-1 flex flex-col px-4 pt-8 pb-6 gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">AI-планер дня</h1>
        <p className="text-neutral-500 text-sm mt-1">
          Три кроки — і в голові порядок.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {STEPS.map((step) => (
          <div
            key={step.title}
            className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:bg-neutral-900 dark:border-neutral-800"
          >
            <span className="text-3xl flex-shrink-0">{step.icon}</span>
            <div>
              <p className="font-medium">{step.title}</p>
              <p className="text-sm text-neutral-500">{step.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1" />

      <div className="flex flex-col gap-3">
        <label htmlFor="name" className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
          Як тебе звати?
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
          placeholder="Наприклад, Леся"
          className="h-16 w-full rounded-2xl border border-neutral-200 bg-white px-5 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-800"
          autoFocus
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!name.trim()}
          className="h-16 rounded-2xl bg-neutral-900 text-white text-lg font-medium disabled:opacity-30 active:scale-[0.98] transition-transform dark:bg-white dark:text-neutral-900"
        >
          Почати
        </button>
      </div>
    </div>
  );
}
