"use client";

import { useRef, useState } from "react";
import { useApp } from "@/lib/store";
import type { ParsedTask } from "@/lib/types";

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

interface WindowWithSpeechRecognition extends Window {
  SpeechRecognition?: SpeechRecognitionCtor;
  webkitSpeechRecognition?: SpeechRecognitionCtor;
}

export default function CapturePage() {
  const { addCaptureAndTasks } = useApp();
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [micSupported, setMicSupported] = useState(true);
  const [usedVoice, setUsedVoice] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  async function handleSave() {
    const rawText = text.trim();
    if (!rawText || isSaving) return;

    setIsSaving(true);
    const source = usedVoice ? "voice" : "text";
    let tasks: ParsedTask[];

    try {
      const response = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText }),
      });
      const data = await response.json();
      tasks =
        Array.isArray(data?.tasks) && data.tasks.length > 0
          ? data.tasks
          : [{ title: rawText, priority: null, scheduledTime: null, deadline: null }];
    } catch {
      tasks = [{ title: rawText, priority: null, scheduledTime: null, deadline: null }];
    }

    addCaptureAndTasks(rawText, tasks, source);
    setText("");
    setUsedVoice(false);
    setIsSaving(false);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1200);
  }

  function toggleMic() {
    const { SpeechRecognition, webkitSpeechRecognition } =
      window as WindowWithSpeechRecognition;
    const SpeechRecognitionCtor = SpeechRecognition || webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      setMicSupported(false);
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const recognition: SpeechRecognitionLike = new SpeechRecognitionCtor();
    recognition.lang = "uk-UA";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setUsedVoice(true);
      setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  }

  return (
    <div className="flex-1 flex flex-col px-4 pt-6 pb-4 gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Що в голові?</h1>
        <p className="text-neutral-500 text-sm mt-1">
          Пиши або диктуй усе підряд — AI розбере на задачі.
        </p>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Наприклад: купити хліб, подзвонити мамі, підготувати звіт до п'ятниці…"
        className="flex-1 w-full resize-none rounded-3xl border border-neutral-200 bg-white p-5 text-lg leading-relaxed shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-800"
      />

      {!micSupported && (
        <p className="text-sm text-red-500 text-center">
          Диктування голосом не підтримується у цьому браузері.
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleMic}
          aria-pressed={isRecording}
          aria-label={isRecording ? "Зупинити диктування" : "Диктувати"}
          className={`flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-full text-3xl shadow-lg active:scale-95 transition-transform ${
            isRecording
              ? "bg-red-500 text-white animate-pulse"
              : "bg-blue-600 text-white"
          }`}
        >
          🎤
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={!text.trim() || isSaving}
          className="flex-1 h-16 rounded-2xl bg-neutral-900 text-white text-lg font-medium disabled:opacity-30 active:scale-[0.98] transition-transform dark:bg-white dark:text-neutral-900"
        >
          {isSaving ? "Аналізую…" : savedFlash ? "Збережено ✓" : "Розібрати на задачі"}
        </button>
      </div>
    </div>
  );
}
