function toDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTodayDateString(): string {
  return toDateString(new Date());
}

const WEEKDAYS_UK = [
  "неділя",
  "понеділок",
  "вівторок",
  "середа",
  "четвер",
  "п'ятниця",
  "субота",
];

export function getTodayWeekday(): string {
  return WEEKDAYS_UK[new Date().getDay()];
}

const WEEKDAYS_SHORT_UK = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

/** Dates (YYYY-MM-DD) for the current calendar week, Monday through Sunday. */
export function getCurrentWeekDates(): string[] {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday .. 6 = Saturday
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return toDateString(d);
  });
}

export function formatDayLabel(dateString: string): string {
  const d = new Date(`${dateString}T00:00:00`);
  const weekday = WEEKDAYS_SHORT_UK[d.getDay()];
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${weekday}, ${day}.${month}`;
}
