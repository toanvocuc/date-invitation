"use client";

import StageCard from "@/components/ui/StageCard";
import StageHeading from "@/components/ui/StageHeading";
import SelectionCard from "@/components/ui/SelectionCard";
import SelectionList from "@/components/ui/SelectionList";
import ActionButton from "@/components/ui/ActionButton";
import BackButton from "@/components/ui/BackButton";
import { beforeDinnerActivityOptions } from "@/data/stageOptions";
import type { StageProps } from "@/types/date";

const COPY = {
  title: "Where should we go before dinner? 🌸",
  subtitle: "Pick the one that sounds nicest right now.",
  next: "NEXT →",
  hint: "Pick a place to keep going",
};

export default function Stage1_5({
  plan,
  update,
  advance,
  goBack,
}: StageProps) {
  const selected = plan.beforeDinnerActivity;

  return (
    <StageCard>
      <StageHeading title={COPY.title} subtitle={COPY.subtitle} />

      <SelectionList label="Where to go before dinner">
        {beforeDinnerActivityOptions.map((option) => (
          <SelectionCard
            key={option.value}
            emoji={option.emoji}
            title={option.title}
            description={option.description}
            selected={selected === option.value}
            onSelect={() => update({ beforeDinnerActivity: option.value })}
          />
        ))}
      </SelectionList>

      <div className="mt-6 flex flex-col items-center gap-3.5">
        <ActionButton
          onClick={() => advance()}
          disabled={!selected}
          disabledHint={COPY.hint}
        >
          {COPY.next}
        </ActionButton>
        <BackButton onClick={goBack} />
      </div>
    </StageCard>
  );
}
