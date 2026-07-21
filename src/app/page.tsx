"use client";

import { useEffect, useRef, useState } from "react";
import { useApp } from "@/lib/store";
import type { ParsedTask } from "@/lib/types";
import { PlansIcon } from "@/components/icons";

const EXAMPLE_PROMPTS = [
  "Купити хліб, помити машину і подзвонити мамі ввечері",
  "Підготувати звіт до п'ятниці, записатись до лікаря",
];

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

interface SpeechRecognitionErrorEventLike {
  error: string;
}

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

interface WindowWithSpeechRecognition extends Window {
  SpeechRecognition?: SpeechRecognitionCtor;
  webkitSpeechRecognition?: SpeechRecognitionCtor;
}

export default function CapturePage() {
  const { user, addCaptureAndTasks, draftText, setDraftText } = useApp();
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [micSupported, setMicSupported] = useState(true);
  const [usedVoice, setUsedVoice] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const wantsRecordingRef = useRef(false);
  const isSessionActiveRef = useRef(false);

  useEffect(() => {
    // Runs once on mount to pick up an example handed off from another
    // screen's empty state; draftText/setDraftText are stable from context.
    if (draftText) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setText(draftText);
      setDraftText("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  function startRecognition(SpeechRecognitionCtor: SpeechRecognitionCtor) {
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

    recognition.onerror = (event) => {
      // Chrome stops the session on "no-speech" pauses even in continuous
      // mode — onend below restarts it, so only unrecoverable errors here
      // should actually stop recording.
      if (event?.error === "not-allowed" || event?.error === "audio-capture") {
        wantsRecordingRef.current = false;
        isSessionActiveRef.current = false;
        setIsRecording(false);
      }
    };

    recognition.onend = () => {
      isSessionActiveRef.current = false;
      if (wantsRecordingRef.current) {
        // Restarting the same instance (rather than creating a new one)
        // avoids racing the browser's teardown of this session.
        isSessionActiveRef.current = true;
        recognition.start();
      } else {
        setIsRecording(false);
      }
    };

    recognitionRef.current = recognition;
    isSessionActiveRef.current = true;
    recognition.start();
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
      wantsRecordingRef.current = false;
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    wantsRecordingRef.current = true;
    setIsRecording(true);

    if (isSessionActiveRef.current) {
      // Previous session is still tearing down — its onend handler will
      // notice wantsRecordingRef and restart itself. Starting a second
      // instance here would race the browser and silently fail to record.
      return;
    }

    startRecognition(SpeechRecognitionCtor);
  }

  return (
    <div className="flex-1 flex flex-col px-4 pt-6 pb-4 gap-4">
      <div className="flex items-center gap-3">
        <span className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-indigo-100 to-blue-50 text-indigo-600 dark:from-indigo-950 dark:to-blue-950 dark:text-indigo-300">
          <PlansIcon className="w-6 h-6" />
        </span>
        <div>
          {user && (
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 leading-none mb-1">
              Привіт, {user.name}!
            </p>
          )}
          <h1 className="text-2xl font-semibold leading-tight">Що в голові?</h1>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-3 min-h-0">
        <div className="flex-1 flex flex-col min-h-0 rounded-3xl bg-white shadow-sm border border-neutral-100 overflow-hidden dark:bg-neutral-900 dark:border-neutral-800 focus-within:ring-2 focus-within:ring-indigo-500">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Наприклад: купити хліб, подзвонити мамі, підготувати звіт до п'ятниці…"
            className="flex-1 w-full resize-none bg-transparent p-5 text-lg leading-relaxed focus:outline-none"
          />
          <div className="flex items-center gap-3 border-t border-neutral-100 px-3 py-3 dark:border-neutral-800">
            <button
              type="button"
              onClick={toggleMic}
              aria-pressed={isRecording}
              aria-label={isRecording ? "Зупинити диктування" : "Диктувати"}
              className={`flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full text-3xl shadow-sm active:scale-95 transition-transform ${
                isRecording
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-indigo-600 text-white"
              }`}
            >
              🎤
            </button>
            <p className="text-xs text-neutral-400">
              {isRecording ? "Слухаю… натисни, щоб зупинити" : "Диктуй або друкуй — байдуже"}
            </p>
          </div>
        </div>

        {!text && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-neutral-400 px-1">
              Не знаєш, з чого почати? Тапни приклад:
            </p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setText(prompt)}
                  className="text-left text-sm rounded-full bg-neutral-100 px-3.5 py-2 text-neutral-600 active:scale-[0.97] transition-transform dark:bg-neutral-800 dark:text-neutral-300"
                >
                  💡 {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {!micSupported && (
        <p className="text-sm text-red-500 text-center">
          Диктування голосом не підтримується у цьому браузері.
        </p>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={!text.trim() || isSaving}
        className="h-16 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-lg font-medium shadow-sm disabled:opacity-30 active:scale-[0.98] transition-transform"
      >
        {isSaving ? "Аналізую…" : savedFlash ? "Збережено ✓" : "Розібрати на задачі"}
      </button>
    </div>
  );
}
