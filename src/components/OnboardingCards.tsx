"use client";

import { useState } from "react";

const STEPS = [
  {
    icon: "🧠",
    title: "Вивали з голови все",
    text: "Словами чи голосом, без порядку й форматування — просто потік думок.",
    cta: "Далі",
  },
  {
    icon: "🪄",
    title: "AI розкладе по поличках",
    text: "Сам розбере хаос на окремі задачі: що терміново, що коли.",
    cta: "Далі",
  },
  {
    icon: "🎯",
    title: "Забирай найважливіше",
    text: "У список на сьогодні — і викреслюй зроблене з насолодою.",
    cta: "Почати",
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
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <span className="text-6xl animate-celebrate">✅</span>
        <p className="text-neutral-500 text-sm">Погнали!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col px-4 pt-8 pb-6">
      <div className="flex justify-center gap-2 mb-8">
        {STEPS.map((_, i) => (
          <span
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === stepIndex
                ? "w-8 bg-blue-600"
                : i < stepIndex
                  ? "w-2 bg-blue-300"
                  : "w-2 bg-neutral-200 dark:bg-neutral-700"
            }`}
          />
        ))}
      </div>

      <div
        key={stepIndex}
        className="flex-1 flex flex-col items-center justify-center text-center gap-4 animate-card-in"
      >
        <span className="text-7xl">{step.icon}</span>
        <h1 className="text-2xl font-semibold">{step.title}</h1>
        <p className="text-neutral-500 text-base max-w-xs">{step.text}</p>
      </div>

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
