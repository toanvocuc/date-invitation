"use client";

import { motion } from "framer-motion";

interface SelectionCardProps {
  emoji: string;
  title: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
}

/** Variant used by the parent list to stagger the cards in. */
export const selectionCardVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

export default function SelectionCard({
  emoji,
  title,
  description,
  selected,
  onSelect,
}: SelectionCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      variants={selectionCardVariants}
      whileHover={{ scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 26 }}
      className={`group relative flex w-full items-center gap-4 rounded-2xl border px-4 py-3.5 text-left transition-colors duration-200 sm:px-5 ${
        selected
          ? "border-blush-400 bg-white shadow-[0_14px_34px_-18px_rgba(214,70,120,0.7)]"
          : "border-white/80 bg-white/60 hover:border-blush-300 hover:bg-white/90"
      }`}
    >
      <span
        aria-hidden="true"
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-xl transition-colors duration-200 ${
          selected ? "bg-blush-100" : "bg-blush-50 group-hover:bg-blush-100"
        }`}
      >
        {emoji}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[0.95rem] leading-snug font-semibold text-plum-700 sm:text-base">
          {title}
        </span>
        {description ? (
          <span className="mt-0.5 block text-[0.8rem] leading-snug text-plum-500/85">
            {description}
          </span>
        ) : null}
      </span>

      <motion.span
        aria-hidden="true"
        initial={false}
        animate={{
          opacity: selected ? 1 : 0,
          scale: selected ? 1 : 0.5,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 24 }}
        className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blush-500 text-[0.7rem] text-white"
      >
        ❤
      </motion.span>
    </motion.button>
  );
}
