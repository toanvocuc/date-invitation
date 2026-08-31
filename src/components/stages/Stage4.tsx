"use client";

import { motion } from "framer-motion";
import StageCard from "@/components/ui/StageCard";
import ActionButton from "@/components/ui/ActionButton";
import BackButton from "@/components/ui/BackButton";
import type { StageProps } from "@/types/date";

const COPY = {
  lead: "Before our date...\nthere is one more thing. ❤️",
  tease: "I have prepared a little game for us to warm things up. 😏",
  description:
    "A little Q&A game about us, our memories, and the things we love about each other.",
  cta: "LET'S PLAY ❤️",
};

/**
 * An announcement, not a question.
 *
 * The real Q&A game will live in its own stage inserted directly after this one
 * (add the id to STAGE_ORDER in src/lib/flow.ts and a case in DateInvitation).
 * For now the button just carries on to Stage 5.
 */
export default function Stage4({ advance, goBack }: StageProps) {
  return (
    <StageCard className="text-center">
      <motion.div
        aria-hidden="true"
        animate={{ scale: [1, 1.16, 1], rotate: [0, -6, 6, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-blush-200 to-peach-200 text-4xl shadow-[0_16px_36px_-20px_rgba(214,70,120,0.9)]"
      >
        ❤️
      </motion.div>

      <h1 className="font-display mt-6 text-2xl leading-snug font-semibold whitespace-pre-line text-plum-700 sm:text-[1.75rem]">
        {COPY.lead}
      </h1>

      <p className="mx-auto mt-4 max-w-md text-[0.95rem] leading-relaxed text-plum-600">
        {COPY.tease}
      </p>

      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-plum-500/85">
        {COPY.description}
      </p>

      <div className="mt-6 flex flex-col items-center gap-3.5">
        <ActionButton onClick={() => advance({ sawGameIntro: true })}>
          {COPY.cta}
        </ActionButton>
        <BackButton onClick={goBack} />
      </div>
    </StageCard>
  );
}
