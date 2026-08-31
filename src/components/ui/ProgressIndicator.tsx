"use client";

import { motion } from "framer-motion";
import type { DatePlan, StageId } from "@/types/date";
import { getVisibleProgressStages } from "@/lib/flow";

interface ProgressIndicatorProps {
  current: StageId;
  plan: DatePlan;
}

/**
 * ❤️
 * 1 ─ 1.5 ─ 2 ─ 3 ─ 4 ─ 5
 *
 * Stage 1.5 disappears from the row as soon as Stage 1 is answered "no".
 */
export default function ProgressIndicator({
  current,
  plan,
}: ProgressIndicatorProps) {
  const stages = getVisibleProgressStages(plan);
  const currentIndex = stages.findIndex((stage) => stage.id === current);
  // "complete" is past the last dot, so treat an unknown stage as finished.
  const activeIndex = currentIndex === -1 ? stages.length : currentIndex;

  return (
    <div className="flex flex-col items-center gap-1.5 select-none">
      <motion.span
        aria-hidden="true"
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="text-sm"
      >
        ❤️
      </motion.span>

      <p className="sr-only" aria-live="polite">
        {activeIndex >= stages.length
          ? "All questions answered"
          : `Question ${activeIndex + 1} of ${stages.length}`}
      </p>

      <ol aria-hidden="true" className="flex items-center gap-1.5">
        {stages.map((stage, index) => {
          const isDone = index < activeIndex;
          const isCurrent = index === activeIndex;

          return (
            <li key={stage.id} className="flex items-center gap-1.5">
              {index > 0 ? (
                <span
                  className={`block h-px w-4 transition-colors duration-300 sm:w-5 ${
                    isDone || isCurrent ? "bg-blush-400/70" : "bg-plum-500/20"
                  }`}
                />
              ) : null}

              <motion.span
                initial={false}
                animate={{ scale: isCurrent ? 1.08 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 24 }}
                className={`inline-flex min-w-6 items-center justify-center rounded-full px-1.5 py-0.5 text-[0.62rem] font-semibold tabular-nums transition-colors duration-300 ${
                  isCurrent
                    ? "bg-blush-500 text-white shadow-[0_6px_14px_-8px_rgba(214,70,120,1)]"
                    : isDone
                      ? "bg-blush-200 text-blush-600"
                      : "bg-white/60 text-plum-500/50"
                }`}
              >
                {stage.label}
              </motion.span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
