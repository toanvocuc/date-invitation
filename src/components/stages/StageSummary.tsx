"use client";

import { motion } from "framer-motion";
import StageCard from "@/components/ui/StageCard";
import StageHeading from "@/components/ui/StageHeading";
import ActionButton from "@/components/ui/ActionButton";
import BackButton from "@/components/ui/BackButton";
import { buildSummary } from "@/lib/summary";
import type { StageProps } from "@/types/date";

const COPY = {
  title: "So here is our date ❤️",
  subtitle: "Have a last look. Tap any line to change it.",
  confirm: "PERFECT, SEND IT 💌",
  sending: "SENDING...",
  change: "change",
};

interface StageSummaryProps extends StageProps {
  onConfirm: () => void;
  isSending: boolean;
}

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

/**
 * The last look before anything is sent. Every line jumps back to the stage it
 * came from, so an answer can be corrected without losing the others.
 */
export default function StageSummary({
  plan,
  goBack,
  goTo,
  onConfirm,
  isSending,
}: StageSummaryProps) {
  const rows = buildSummary(plan);

  return (
    <StageCard>
      <StageHeading title={COPY.title} subtitle={COPY.subtitle} />

      <motion.ul
        variants={listVariants}
        initial="hidden"
        animate="show"
        className="mt-5 flex flex-col gap-2.5"
      >
        {rows.map((row) => (
          <motion.li key={row.key} variants={rowVariants}>
            <button
              type="button"
              onClick={() => goTo(row.stage)}
              aria-label={`${row.label}: ${row.value}. Change this answer`}
              className="group flex w-full items-center gap-4 rounded-2xl border border-white/80 bg-white/60 px-4 py-3.5 text-left transition-colors duration-200 hover:border-blush-300 hover:bg-white/90 sm:px-5"
            >
              <span
                aria-hidden="true"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blush-50 text-xl transition-colors duration-200 group-hover:bg-blush-100"
              >
                {row.emoji}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-[0.7rem] font-semibold tracking-wide text-plum-500/70 uppercase">
                  {row.label}
                </span>
                <span className="mt-0.5 block text-[0.95rem] leading-snug font-semibold text-plum-700 sm:text-base">
                  {row.value}
                </span>
              </span>

              <span
                aria-hidden="true"
                className="shrink-0 text-[0.7rem] font-medium text-plum-500/45 transition-colors duration-200 group-hover:text-blush-600"
              >
                {COPY.change}
              </span>
            </button>
          </motion.li>
        ))}
      </motion.ul>

      <div className="mt-6 flex flex-col items-center gap-3.5">
        <ActionButton onClick={onConfirm} disabled={isSending}>
          {isSending ? COPY.sending : COPY.confirm}
        </ActionButton>
        <BackButton onClick={goBack} />
      </div>
    </StageCard>
  );
}
