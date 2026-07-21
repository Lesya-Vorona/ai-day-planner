"use client";

import type { ReactNode } from "react";

export function EmptyState({
  icon,
  gradient,
  title,
  subtitle,
  children,
}: {
  icon: string;
  gradient: string;
  title: string;
  subtitle: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 px-2">
      <div
        className={`flex items-center justify-center w-20 h-20 rounded-full text-4xl bg-gradient-to-br ${gradient} shadow-inner`}
      >
        {icon}
      </div>
      <div className="flex flex-col gap-1.5 max-w-xs">
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-sm text-neutral-500 leading-relaxed">{subtitle}</p>
      </div>
      {children && (
        <div className="flex flex-col items-stretch gap-2 w-full max-w-xs mt-1">
          {children}
        </div>
      )}
    </div>
  );
}
