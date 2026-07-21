"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";

export function NameStep() {
  const { createUser } = useApp();
  const [name, setName] = useState("");

  function handleSubmit() {
    if (!name.trim()) return;
    createUser(name);
  }

  return (
    <div className="flex-1 flex flex-col px-4 pt-8 pb-6 gap-6 animate-card-in bg-gradient-to-b from-rose-100 to-amber-50 dark:from-rose-950 dark:to-amber-950">
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
        <div className="flex items-center justify-center w-32 h-32 rounded-full bg-white/70 shadow-sm dark:bg-black/20">
          <span className="text-6xl">👋</span>
        </div>
        <h1 className="text-2xl font-semibold">Як тебе звати?</h1>
        <p className="text-neutral-600 dark:text-neutral-300 text-sm max-w-xs">
          Без пошти й пароля — просто щоб було зручніше звертатись.
        </p>
      </div>

      <div className="flex flex-col gap-3">
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
          Почати планувати
        </button>
      </div>
    </div>
  );
}
