"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Захопити", icon: "✏️" },
  { href: "/inbox", label: "Вхідні", icon: "📥" },
  { href: "/today", label: "Сьогодні", icon: "✅" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 inset-x-0 z-50 border-t border-neutral-200 bg-white/95 backdrop-blur pb-[env(safe-area-inset-bottom)] dark:bg-neutral-900/95 dark:border-neutral-800">
      <ul className="grid grid-cols-3">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                className={`flex flex-col items-center justify-center gap-1 py-3 min-h-[64px] text-sm font-medium transition-colors ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-neutral-400 dark:text-neutral-500"
                }`}
              >
                <span className="text-2xl leading-none">{tab.icon}</span>
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
