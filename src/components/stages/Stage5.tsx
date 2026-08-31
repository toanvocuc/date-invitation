"use client";

import StageCard from "@/components/ui/StageCard";
import StageHeading from "@/components/ui/StageHeading";
import SelectionCard from "@/components/ui/SelectionCard";
import SelectionList from "@/components/ui/SelectionList";
import ActionButton from "@/components/ui/ActionButton";
import BackButton from "@/components/ui/BackButton";
import { dressCodeOptions } from "@/data/dressCode";
import type { StageProps } from "@/types/date";

const COPY = {
  title: "Okay... what are we wearing? 👗❤️",
  subtitle: "So we do not show up in two different moods.",
  next: "SEE OUR PLAN →",
  hint: "Pick a dress code to keep going",
};

/**
 * Options come from `src/data/dressCode.ts` on purpose - edit that file to
 * change the choices, no changes needed here.
 */
export default function Stage5({ plan, update, advance, goBack }: StageProps) {
  const selected = plan.dressCode;

  return (
    <StageCard>
      <StageHeading title={COPY.title} subtitle={COPY.subtitle} />

      <SelectionList label="Dress code">
        {dressCodeOptions.map((option) => (
          <SelectionCard
            key={option.value}
            emoji={option.emoji}
            title={option.title}
            description={option.description}
            selected={selected === option.value}
            onSelect={() => update({ dressCode: option.value })}
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
