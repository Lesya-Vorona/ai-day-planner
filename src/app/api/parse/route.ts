import { NextResponse } from "next/server";
import type { ParsedTask, TaskPriority } from "@/lib/types";
import { getTodayDateString } from "@/lib/date";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "openai/gpt-4o-mini";
const VALID_PRIORITIES: TaskPriority[] = ["high", "medium", "low"];

function buildSystemPrompt() {
  return `Ти асистент, який перетворює довільний потік думок користувача на список окремих атомарних задач.
Поверни ЛИШЕ валідний JSON-масив без жодного тексту навколо, кожен елемент у форматі:
{"title": string, "priority": "high" | "medium" | "low" | null, "scheduledTime": "HH:mm" | null, "deadline": "YYYY-MM-DD" | null}

Правила:
- Кожен елемент масиву — одна конкретна дія (атомарна задача).
- title формулюй коротко, тією ж мовою, що й вхідний текст.
- priority визнач за терміновістю й важливістю сказаного; якщо незрозуміло — null.
- scheduledTime заповнюй, тільки якщо користувач явно назвав час доби.
- deadline заповнюй, тільки якщо явно названо дату/день; сьогоднішня дата — ${getTodayDateString()}, переводь відносні дати ("завтра", "у п'ятницю") у формат YYYY-MM-DD відносно неї.
- Якщо в тексті взагалі немає задач, поверни [].
Відповідай лише JSON-масивом, без пояснень і без markdown-обгортки.`;
}

function extractJson(content: string): string {
  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return (fenced ? fenced[1] : content).trim();
}

function sanitizeParsedTasks(raw: unknown): ParsedTask[] {
  if (!Array.isArray(raw)) return [];

  const tasks: ParsedTask[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const candidate = item as Record<string, unknown>;
    const title = typeof candidate.title === "string" ? candidate.title.trim() : "";
    if (!title) continue;

    const priority = VALID_PRIORITIES.includes(candidate.priority as TaskPriority)
      ? (candidate.priority as TaskPriority)
      : null;
    const scheduledTime =
      typeof candidate.scheduledTime === "string" ? candidate.scheduledTime : null;
    const deadline = typeof candidate.deadline === "string" ? candidate.deadline : null;

    tasks.push({ title, priority, scheduledTime, deadline });
  }
  return tasks;
}

async function callOpenRouter(rawText: string): Promise<ParsedTask[] | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error("OPENROUTER_API_KEY is not set");
    return null;
  }

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: buildSystemPrompt() },
        { role: "user", content: rawText },
      ],
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    console.error("OpenRouter request failed", response.status, await response.text());
    return null;
  }

  const data = await response.json();
  const content: string | undefined = data?.choices?.[0]?.message?.content;
  if (!content) return null;

  try {
    const parsed = JSON.parse(extractJson(content));
    const tasks = sanitizeParsedTasks(parsed);
    return tasks.length > 0 ? tasks : null;
  } catch {
    return null;
  }
}

function fallbackTask(rawText: string): ParsedTask[] {
  return [{ title: rawText.trim(), priority: null, scheduledTime: null, deadline: null }];
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const rawText = typeof body?.rawText === "string" ? body.rawText.trim() : "";

  if (!rawText) {
    return NextResponse.json({ error: "rawText is required" }, { status: 400 });
  }

  let tasks = await callOpenRouter(rawText);
  if (!tasks) {
    tasks = await callOpenRouter(rawText); // one retry
  }
  if (!tasks) {
    tasks = fallbackTask(rawText);
  }

  return NextResponse.json({ tasks });
}
