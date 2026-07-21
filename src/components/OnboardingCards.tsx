"use client";

import { useState } from "react";

const STEPS = [
  {
    icon: "🧠",
    title: "Вивали з голови все",
    text: "Словами чи голосом, без порядку й форматування — просто потік думок.",
    cta: "Далі",
    gradient: "from-violet-200 to-fuchsia-100 dark:from-violet-950 dark:to-fuchsia-950",
  },
  {
    icon: "🪄",
    title: "AI розкладе по поличках",
    text: "Сам розбере хаос на окремі задачі: що терміново, що коли.",
    cta: "Далі",
    gradient: "from-blue-200 to-cyan-100 dark:from-blue-950 dark:to-cyan-950",
  },
  {
    icon: "🎯",
    title: "Забирай найважливіше",
    text: "У список на сьогодні — і викреслюй зроблене з насолодою.",
    cta: "Почати",
    gradient: "from-emerald-200 to-teal-100 dark:from-emerald-950 dark:to-teal-950",
  },
];

export function OnboardingCards({ onComplete }: { onComplete: () => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  function handleNext() {
    if (!isLast) {
      setStepIndex((i) => i + 1);
      return;
    }
    setIsCelebrating(true);
    setTimeout(onComplete, 500);
  }

  if (isCelebrating) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-emerald-50 to-transparent dark:from-emerald-950/40">
        <span className="text-6xl animate-celebrate">✅</span>
        <p className="text-neutral-500 text-sm">Погнали!</p>
      </div>
    );
  }

  return (
    <div
      className={`flex-1 flex flex-col px-4 pt-8 pb-6 bg-gradient-to-b ${step.gradient} transition-colors duration-500`}
    >
      <div className="flex justify-center gap-2 mb-8">
        {STEPS.map((_, i) => (
          <span
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === stepIndex
                ? "w-8 bg-neutral-900 dark:bg-white"
                : i < stepIndex
                  ? "w-2 bg-neutral-900/40 dark:bg-white/40"
                  : "w-2 bg-neutral-900/15 dark:bg-white/15"
            }`}
          />
        ))}
      </div>

      <div
        key={stepIndex}
        className="flex flex-col items-center justify-center text-center gap-4 min-h-[42vh] animate-card-in"
      >
        <div className="flex items-center justify-center w-32 h-32 rounded-full bg-white/70 shadow-sm dark:bg-black/20">
          <span className="text-7xl">{step.icon}</span>
        </div>
        <h1 className="text-2xl font-semibold">{step.title}</h1>
        <p className="text-neutral-600 dark:text-neutral-300 text-base max-w-xs">
          {step.text}
        </p>
      </div>

      <div className="flex-1" />

      <button
        type="button"
        onClick={handleNext}
        className="h-16 rounded-2xl bg-neutral-900 text-white text-lg font-medium active:scale-[0.98] transition-transform dark:bg-white dark:text-neutral-900"
      >
        {step.cta}
      </button>
    </div>
  );
}
