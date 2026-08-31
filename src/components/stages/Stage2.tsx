"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StageCard from "@/components/ui/StageCard";
import StageHeading from "@/components/ui/StageHeading";
import SelectionCard from "@/components/ui/SelectionCard";
import SelectionList from "@/components/ui/SelectionList";
import ActionButton from "@/components/ui/ActionButton";
import BackButton from "@/components/ui/BackButton";
import { CUSTOM_FOOD_VALUE, foodOptions } from "@/data/stageOptions";
import type { StageProps } from "@/types/date";

const COPY = {
  title: "What kind of food do you want on our date? 🍽️",
  subtitle: "Say the word and I will find the place.",
  inputLabel: "Tell me what you have in mind",
  placeholder: "Tell me what you have in mind...",
  next: "NEXT →",
  hintChoose: "Pick something to keep going",
  hintCustom: "Write it down first and we are set",
};

const MAX_CUSTOM_LENGTH = 120;

export default function Stage2({ plan, update, advance, goBack }: StageProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const isCustom = plan.foodChoice === CUSTOM_FOOD_VALUE;
  const customText = plan.customFoodChoice ?? "";
  const customFilled = customText.trim().length > 0;
  const canContinue = Boolean(plan.foodChoice) && (!isCustom || customFilled);

  // Put the cursor straight into the field when the option opens it.
  useEffect(() => {
    if (isCustom) inputRef.current?.focus();
  }, [isCustom]);

  const submit = () => {
    if (!canContinue) return;
    advance(isCustom ? { customFoodChoice: customText.trim() } : undefined);
  };

  return (
    <StageCard>
      <StageHeading title={COPY.title} subtitle={COPY.subtitle} />

      <SelectionList label="Food for our date">
        {foodOptions.map((option) => (
          <SelectionCard
            key={option.value}
            emoji={option.emoji}
            title={option.title}
            description={option.description}
            selected={plan.foodChoice === option.value}
            onSelect={() => update({ foodChoice: option.value })}
          />
        ))}
      </SelectionList>

      <AnimatePresence initial={false}>
        {isCustom ? (
          <motion.div
            key="custom-food"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <label
              htmlFor="custom-food-input"
              className="block px-1 text-xs font-medium text-plum-500/85"
            >
              {COPY.inputLabel}
            </label>
            <input
              id="custom-food-input"
              ref={inputRef}
              type="text"
              value={customText}
              maxLength={MAX_CUSTOM_LENGTH}
              onChange={(event) =>
                update({ customFoodChoice: event.target.value })
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") submit();
              }}
              placeholder={COPY.placeholder}
              aria-required="true"
              className="mt-1.5 w-full rounded-2xl border border-blush-200 bg-white/90 px-4 py-3 text-[0.95rem] text-plum-700 shadow-inner transition-colors duration-200 outline-none placeholder:text-plum-500/40 focus:border-blush-400"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="mt-6 flex flex-col items-center gap-3.5">
        <ActionButton
          onClick={submit}
          disabled={!canContinue}
          disabledHint={isCustom ? COPY.hintCustom : COPY.hintChoose}
        >
          {COPY.next}
        </ActionButton>
        <BackButton onClick={goBack} />
      </div>
    </StageCard>
  );
}
