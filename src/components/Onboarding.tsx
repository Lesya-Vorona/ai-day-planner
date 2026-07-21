"use client";

import { useState } from "react";
import { OnboardingCards } from "./OnboardingCards";
import { NameStep } from "./NameStep";

export function Onboarding() {
  const [stage, setStage] = useState<"cards" | "name">("cards");

  if (stage === "cards") {
    return <OnboardingCards onComplete={() => setStage("name")} />;
  }

  return <NameStep />;
}
