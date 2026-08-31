"use client";

import { useEffect, useRef } from "react";
import StageCard from "@/components/ui/StageCard";
import StageHeading from "@/components/ui/StageHeading";
import SelectionCard from "@/components/ui/SelectionCard";
import SelectionList from "@/components/ui/SelectionList";
import { beforeDinnerOptions } from "@/data/stageOptions";
import type { StageProps, YesNo } from "@/types/date";

const COPY = {
  title: "Do you want to go somewhere before dinner? ❤️",
  subtitle: "No pressure. Both answers end with food.",
};

/** How long the chosen card stays visible before the stage slides away. */
const CONFIRM_DELAY_MS = 340;

export default function Stage1({ plan, update, advance }: StageProps) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const locked = useRef(false);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const choose = (value: YesNo) => {
    if (locked.current) return;
    locked.current = true;

    // Show the selection first, then route: yes -> Stage 1.5, no -> Stage 2.
    update({ beforeDinner: value });
    timer.current = setTimeout(() => {
      advance(
        value === "no"
          ? // Changing the answer to "no" drops any place picked earlier.
            { beforeDinner: value, beforeDinnerActivity: undefined }
          : { beforeDinner: value },
      );
    }, CONFIRM_DELAY_MS);
  };

  return (
    <StageCard>
      <StageHeading title={COPY.title} subtitle={COPY.subtitle} />

      <SelectionList label="Meet up before dinner?">
        {beforeDinnerOptions.map((option) => (
          <SelectionCard
            key={option.value}
            emoji={option.emoji}
            title={option.title}
            description={option.description}
            selected={plan.beforeDinner === option.value}
            onSelect={() => choose(option.value)}
          />
        ))}
      </SelectionList>
    </StageCard>
  );
}
