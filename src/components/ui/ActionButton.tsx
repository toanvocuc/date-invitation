"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface ActionButtonProps {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  /** Hint shown under the button while it is disabled. */
  disabledHint?: string;
  className?: string;
}

/** The main pink "continue" pill used by every question stage. */
export default function ActionButton({
  children,
  onClick,
  disabled = false,
  disabledHint,
  className = "",
}: ActionButtonProps) {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <motion.button
        type="button"
        onClick={onClick}
        disabled={disabled}
        whileHover={disabled ? undefined : { scale: 1.04, y: -2 }}
        whileTap={disabled ? undefined : { scale: 0.96 }}
        transition={{ type: "spring", stiffness: 420, damping: 24 }}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-br from-blush-400 to-blush-600 px-8 text-sm font-semibold tracking-wide text-white shadow-[0_14px_30px_-14px_rgba(214,70,120,0.95)] transition-opacity duration-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
      >
        {children}
      </motion.button>

      {disabled && disabledHint ? (
        <p className="text-center text-xs text-plum-500/70">{disabledHint}</p>
      ) : null}
    </div>
  );
}
