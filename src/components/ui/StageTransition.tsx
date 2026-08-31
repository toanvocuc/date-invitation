"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface StageTransitionProps {
  children: ReactNode;
  /** 1 = moving forward, -1 = going back. */
  direction: 1 | -1;
}

const variants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 30 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction * -30 }),
};

/**
 * Wraps one stage. Must be the direct child of an <AnimatePresence mode="wait">
 * and carry a `key` equal to the stage id.
 */
export default function StageTransition({
  children,
  direction,
}: StageTransitionProps) {
  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="flex w-full justify-center"
    >
      {children}
    </motion.div>
  );
}
