"use client";

import StageCard from "@/components/ui/StageCard";
import StageHeading from "@/components/ui/StageHeading";
import SelectionCard from "@/components/ui/SelectionCard";
import SelectionList from "@/components/ui/SelectionList";
import ActionButton from "@/components/ui/ActionButton";
import BackButton from "@/components/ui/BackButton";
import { afterDinnerOptions } from "@/data/stageOptions";
import type { StageProps } from "@/types/date";

const COPY = {
  title: "What do you want to do when dinner is over? 🌙",
  subtitle: "The night is still ours.",
  next: "NEXT →",
  hint: "Pick one to keep going",
};

export default function Stage3({ plan, update, advance, goBack }: StageProps) {
  const selected = plan.afterDinnerActivity;

  return (
    <StageCard>
      <StageHeading title={COPY.title} subtitle={COPY.subtitle} />

      <SelectionList label="After dinner">
        {afterDinnerOptions.map((option) => (
          <SelectionCard
            key={option.value}
            emoji={option.emoji}
            title={option.title}
            description={option.description}
            selected={selected === option.value}
            onSelect={() => update({ afterDinnerActivity: option.value })}
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
