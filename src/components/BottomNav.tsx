"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlansIcon, TasksIcon, TodayIcon } from "./icons";

const TABS = [
  { href: "/", label: "Плани", Icon: PlansIcon },
  { href: "/inbox", label: "Завдання", Icon: TasksIcon },
  { href: "/today", label: "Сьогодні", Icon: TodayIcon },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 inset-x-0 z-50 border-t border-neutral-200 bg-white/95 backdrop-blur pb-[env(safe-area-inset-bottom)] dark:bg-neutral-900/95 dark:border-neutral-800">
      <ul className="grid grid-cols-3">
        {TABS.map(({ href, label, Icon }) => {
          const isActive = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex flex-col items-center justify-center gap-1 py-2.5 min-h-[64px] text-xs font-medium transition-colors ${
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-neutral-400 dark:text-neutral-500"
                }`}
              >
                <span
                  className={`flex items-center justify-center w-11 h-8 rounded-full transition-colors ${
                    isActive ? "bg-indigo-50 dark:bg-indigo-950" : ""
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
