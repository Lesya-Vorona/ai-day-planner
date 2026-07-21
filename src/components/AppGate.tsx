"use client";

import type { ReactNode } from "react";
import { useApp } from "@/lib/store";
import { Onboarding } from "./Onboarding";

export function AppGate({ children }: { children: ReactNode }) {
  const { isReady, user } = useApp();

  if (!isReady) return null;
  if (!user) return <Onboarding />;

  return <>{children}</>;
}
